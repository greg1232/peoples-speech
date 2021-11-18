
# Imports the Google Cloud client library
from google.cloud import speech
import os

from smart_open import open

import logging

logger = logging.getLogger(__name__)

class GoogleSpeechAPIClient:
    def __init__(self, config):
        self.config = config
        self.client = speech.SpeechClient()

    def load(self, path):
        pass

    def predict(self, path):

        logger.debug("Running google speech to text on: " + path)

        gcs_path = self.copy_to_gcs(path)

        audio = speech.RecognitionAudio(uri=gcs_path)

        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.FLAC,
            sample_rate_hertz=16000,
            language_code=self.config["deploy"]["model"]["language"],
        )

        response = self.client.recognize(config=config, audio=audio)

        logger.debug(" Got response " + str(response))

        labels = []
        score = 0.0

        for result in response.results:
            labels.append(result.alternatives[0].transcript)
            score = result.alternatives[0].confidence

        result = {
            "score" : score,
            "label" : "".join(labels)
        }

        logger.debug(" result is: " + str(result))

        return result

    def copy_to_gcs(self, path):
        gcs_path = os.path.join(self.config["deploy"]["model"]["google_cloud_storage_path"], os.path.basename(path))

        with open(path, "rb") as input_file:
            with open(gcs_path, "wb") as gcs_file:
                gcs_file.write(input_file.read())

        return gcs_path

