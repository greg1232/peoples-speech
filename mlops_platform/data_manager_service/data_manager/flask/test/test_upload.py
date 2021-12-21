
import unittest
import requests

from data_manager.util.config import get_config, create_config

import data_manager

import os

import logging

logger = logging.getLogger(__name__)

test_file_path = os.path.join(os.path.dirname(__file__), "data", "clean-4-one-two-three.flac")

class TestUpload(unittest.TestCase):

    def setUp(self):
        create_config()

    def test_get_upload_url(self):

        url, path = data_manager.get_upload_url_for_file({"path" : os.path.basename(test_file_path)})

        self.assertTrue(len(url) > 0)

    def test_upload_data(self):
        url, path = data_manager.get_upload_url_for_file({"path" : os.path.basename(test_file_path)})

        logger.debug("Uploading " + test_file_path + " to " + url + " with final s3 path " + path)
        with open(test_file_path, 'rb') as data:
            requests.put(url, data=data)

        return path

    def test_register_uploaded_audio(self):
        path = self.test_upload_data()

        entry = data_manager.register_uploaded_audio(path)

        logger.debug("Registered uploaded audio with entry: " + str(entry))

        return entry

    def test_make_transcription_task(self):
        entry = self.test_register_uploaded_audio()

        data_manager.make_transcription_task({}, [{"selected" : 1, "uid" : entry["uid"]}])

        return entry

    def test_get_transcription_tasks(self):
        self.test_make_transcription_task()

        tasks = data_manager.get_transcription_tasks()

        logger.debug("Found transcription tasks: " + str(tasks))

        self.assertTrue(len(tasks) > 0)


    def test_get_transcription_utterances(self):
        entry = self.test_make_transcription_task()

        utterances = data_manager.get_transcription_utterances(entry["uid"])

        logger.debug("Found utterances for transcription task: " + str(utterances))

        self.assertTrue(len(utterances) > 0)

if __name__ == '__main__':
    unittest.main()




