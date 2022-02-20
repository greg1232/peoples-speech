
import tensorflow as tf
import tensorflow_io as tfio
from threading import Lock

import os
import tempfile
import contextlib
from smart_open import open

import logging

logger = logging.getLogger(__name__)


model = None
model_lock = Lock()

class ConformerModelClient:
    def __init__(self, config):
        self.config = config

    def load(self, path):
        global model
        logger.debug("Registering conformer model: " + path)
        model = { "path" : os.path.join(path, "best_saved_model"), "conformer" : None }

    def load_conformer(self):
        global model
        if model["conformer"] is None:
            logger.debug("Loading conformer model from: " + model["path"])
            with get_local_path(model["path"]) as local_path:
                model["conformer"] = tf.saved_model.load(local_path)

    def predict(self, path):
        logger.debug("Getting waveform for: " + path)
        waveform = get_waveform(path)

        model_lock.acquire()
        self.load_conformer()
        try:
            results = model["conformer"].pred(waveform)
            logger.debug("Got predit results: " + str(results))
            transcript, start_times, end_times = results
            score = 1.0

            result = { "score" : score,
                "tags" : "qualifying question",
                "label" : "".join([chr(u) for u in transcript]),
                "start_times" : start_times.numpy().tolist(),
                "end_times" : end_times.numpy().tolist() }

        except:
            result = { "score" : 0.0,
                "label" : "",
                "start_times" : [],
                "end_times" : [] }

        logger.debug("Result: " + str(result))

        model_lock.release()

        return result

def get_waveform(audio_path):
    audio_binary = tf.io.read_file(audio_path)
    waveform = decode_audio(audio_binary)
    return waveform.numpy()

def decode_audio(audio_binary):
    audio = tfio.audio.decode_flac(audio_binary, dtype=tf.int16)
    audio = tf.cast(audio, tf.float32) / 32768.0
    return tf.squeeze(audio, axis=-1)

@contextlib.contextmanager
def get_local_path(path):
    with tempfile.TemporaryDirectory() as tmp:
        copy_file(path, tmp, "variables/variables.index")
        copy_file(path, tmp, "saved_model.pb")
        copy_file(path, tmp, "variables/variables.data-00000-of-00001")

        yield tmp

def copy_file(remote_path, local_path, file_suffix):
    local_file_path = os.path.join(local_path, file_suffix)
    remote_file_path = os.path.join(remote_path, file_suffix)

    os.makedirs(os.path.dirname(local_file_path), exist_ok=True)

    buffer_size = 4096

    with open(local_file_path, "wb") as local_file:
        with open(remote_file_path, "rb") as remote_file:
            data = remote_file.read(buffer_size)

            while len(data) > 0:
                local_file.write(data)
                data = remote_file.read(buffer_size)

