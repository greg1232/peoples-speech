
from concurrent.futures import ThreadPoolExecutor

import docker
import os
import json

import logging

logger = logging.getLogger(__name__)

executor = ThreadPoolExecutor(max_workers=1)

class LocalTrainer:
    def __init__(self, config, train_config_path):
        self.config = config
        self.train_config_path = train_config_path

    def launch(self):
        return executor.submit(TaskRunner(self.config, self.train_config_path)).result()

class TaskRunner:
    def __init__(self, config, train_config_path):
        self.config = config
        self.train_config_path = train_config_path

        self.docker_client = docker.from_env()
        self.low_level_docker_client = docker.APIClient(base_url='unix://var/run/docker.sock')

    def __call__(self):
        self.build()
        self.run()

    def build(self):
        task_container_path = os.path.join(os.path.dirname(__file__), "trainer_container")
        logger.debug("Building container at: " + task_container_path + " for target: " + self.config["target"])
        logs = self.low_level_docker_client.build(path=task_container_path, target=self.config["target"], tag="peoples-speech-task:latest", decode=True)

        for chunk in logs:
            if 'stream' in chunk:
                for line in chunk['stream'].splitlines():
                    logger.debug(line)

    def run(self):
        logger.debug("Running container...")
        container = self.docker_client.containers.run("peoples-speech-task:latest", command=self.train_config_path, detach=True, volumes=
            {self.config["credentials"]["path"]: {'bind': '/root/.aws/credentials', 'mode': 'ro'},
             '/var/run/docker.sock': {'bind': '/var/run/docker.sock', 'mode': 'rw'}})

        for line in container.logs(stream=True):
            logger.debug(line)

