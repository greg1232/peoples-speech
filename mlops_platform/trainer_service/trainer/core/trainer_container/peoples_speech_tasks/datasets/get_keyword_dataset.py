
from smart_open import open
import jsonlines
import json

import tensorflow as tf
import tensorflow_io as tfio

AUTOTUNE = tf.data.AUTOTUNE

def get_keyword_dataset(config, key):
    file_dataset = load_dataset_file(config, key)

    waveform_ds = file_dataset.map(get_waveform_and_label, num_parallel_calls=AUTOTUNE)
    spectrogram_ds = waveform_ds.map(
        get_spectrogram_and_label_id, num_parallel_calls=AUTOTUNE)

    spectrogram_ds = spectrogram_ds.cache()
    spectrogram_ds = spectrogram_ds.repeat(config["model"]["repeat"])
    spectrogram_ds = spectrogram_ds.shuffle(config["model"]["shuffle_buffer_size"], seed=42)
    spectrogram_ds = spectrogram_ds.batch(config["model"]["batch_size"])

    return spectrogram_ds

def get_keyword_dataset_metadata(config, key):
    with open(config["dataset"]["path"]) as dataset_file:
        with jsonlines.Reader(dataset_file) as dataset_reader:
            for line in dataset_reader:
                if not line[key]:
                    continue

                yield line

def load_dataset_file(config, key):
    tf_generator = lambda: (row for row in dataset_file_generator(config, key))
    return tf.data.Dataset.from_generator(tf_generator,
        output_signature=(
            tf.TensorSpec(shape=(), dtype=tf.string),
            tf.TensorSpec(shape=(), dtype=tf.int32)))

def dataset_file_generator(config, key):
    for line in get_dataset_metadata(config, key):
        with open(line["label_path"]) as label_file:
            label = json.load(label_file)["label"]
        yield line["audio_path"], get_label(config, label)

def get_label(config, label_string):
    if label_string.find(config["model"]["label"]) != -1:
        return 1
    return 0

def get_waveform_and_label(audio_path, label):
    #tf.print("Reading from ", audio_path)
    audio_binary = tf.io.read_file(audio_path)
    waveform = decode_audio(audio_binary)
    return waveform, label

def decode_audio(audio_binary):
    audio = tfio.audio.decode_flac(audio_binary, dtype=tf.int16)
    audio = tf.cast(audio, tf.float32) / 32768.0
    return tf.squeeze(audio, axis=-1)

def get_spectrogram_and_label_id(audio, label_id):
    spectrogram = get_spectrogram(audio)
    spectrogram = tf.expand_dims(spectrogram, -1)
    return spectrogram, label_id

def get_spectrogram(waveform):
    maximum_size = 100000

    # truncate to max length
    new_size = tf.minimum(maximum_size, tf.shape(waveform)[-1])

    waveform = waveform[:new_size]

    #tf.print("Waveform shape ", tf.shape(waveform))
    # Padding for files with less than maximum_size samples
    zero_padding = tf.zeros([maximum_size] - tf.shape(waveform), dtype=tf.float32)

    # Concatenate audio with padding so that all audio clips will be of the
    # same length
    waveform = tf.cast(waveform, tf.float32)
    equal_length = tf.concat([waveform, zero_padding], 0)
    spectrogram = tf.signal.stft(equal_length, frame_length=255, frame_step=128)

    spectrogram = tf.abs(spectrogram)

    return spectrogram




