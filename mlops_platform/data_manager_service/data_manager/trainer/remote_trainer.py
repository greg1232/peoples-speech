
import docker
import os
import json
import requests

import logging

logger = logging.getLogger(__name__)

executor = ThreadPoolExecutor(max_workers=1)

class RemoteTrainer:
    def __init__(self, config, train_config_path):
        self.config = config
        self.train_config_path = train_config_path

    def launch(self):
        logger.debug("Launching a remote trainer.")
        response = requests.post(
            url=self.config["model_iteration"]["trainer"]["endpoint"],
            data=self.train_config_path)
        return response
