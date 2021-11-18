import tensorflow as tf
import tensorflow_io as tfio

import logging

logger = logging.getLogger(__name__)

model = None

class KeywordModelClient:
    def __init__(self, config):
        self.config = config

    def load(self, path):
        global model
        logger.debug("Loading model from: " + path)
        model = tf.keras.models.load_model(path)

    def predict(self, path):
        logger.debug("Running predict on: " + path)
        spectrogram = get_spectrogram(path)
        spectrogram = tf.expand_dims(spectrogram, axis=-1)
        spectrogram = tf.expand_dims(spectrogram, axis=0)
        logger.debug("Spectrogram shape is: " + str(spectrogram.shape))

        predictions = tf.nn.softmax(model.predict(spectrogram)).numpy()
        score = float(predictions[0, 1])

        result = { "score" : score }

        logger.debug("Result is: " + str(result))

        add_label(result, self.config)

        return result

def add_label(result, config):
    if result["score"] > 0.5:
        result["label"] = config["model_iteration"]["trainer"]["model"]["label"]
    else:
        result["label"] = "none"

def get_spectrogram(audio_path):
    audio_binary = tf.io.read_file(audio_path)
    waveform = decode_audio(audio_binary)
    return get_spectrogram_from_waveform(waveform)

def decode_audio(audio_binary):
    audio = tfio.audio.decode_flac(audio_binary, dtype=tf.int16)
    audio = tf.cast(audio, tf.float32) / 32768.0
    return tf.squeeze(audio, axis=-1)

def get_spectrogram_from_waveform(waveform):
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


