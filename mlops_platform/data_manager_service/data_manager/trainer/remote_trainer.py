
import os
import json
import requests

import logging

logger = logging.getLogger(__name__)

class RemoteTrainer:
    def __init__(self, config, train_config_path):
        self.config = config
        self.train_config_path = train_config_path

    def launch(self):
        logger.debug("Launching a remote trainer at endpoint: " + self.config["model_iteration"]["trainer"]["endpoint"])
        response = requests.post(
            url=self.config["model_iteration"]["trainer"]["endpoint"],
            json={"path" : self.train_config_path})
        return response
