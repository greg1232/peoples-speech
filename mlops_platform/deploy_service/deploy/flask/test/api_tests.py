import unittest

import deploy
from deploy.util.config import get_config

class TestAPIMethods(unittest.TestCase):

    def setUp(self):
        deploy.util.config.create_config()
        deploy.devices.initialize()

    def test_register_model(self):
        config = get_config()
        deploy.register_model(config["deploy"]["model"]["path"])

    def test_predict(self):
        config = get_config()
        deploy.register_model(config["deploy"]["model"]["path"])
        prediction = deploy.predict(config["deploy"]["test"]["audio_path"])

        self.assertTrue("score" in prediction)
        self.assertTrue("label" in prediction)

    def test_get_devices(self):
        devices = deploy.get_devices({})
        self.assertTrue(len(devices) > 0)

    def test_get_metrics(self):
        metrics = deploy.get_metrics({})
        self.assertTrue(len(metrics) > 0)

if __name__ == '__main__':
    unittest.main()
