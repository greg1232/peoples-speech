import unittest

from data_manager.util.config import get_config, create_config
from data_manager.transcription.auto_segment import segment

import os

import logging

logger = logging.getLogger(__name__)

class TestAutoSegment(unittest.TestCase):

    def setUp(self):
        create_config()

    def test_auto_segment(self):
        config = get_config()

        audio = {
            "audio_path" : os.path.join(os.path.dirname(__file__), "data", "clean-4-one-two-three.flac"),
            "label" : "1 2 3 "
        }

        utterances = segment(audio, config)

        logger.debug("Utterances: " + str(utterances))

        self.assertTrue(len(utterances["utterances"]) == 3)

if __name__ == '__main__':
    unittest.main()

