
from concurrent.futures import ThreadPoolExecutor

import docker
import os
import json


import logging

from trainer.util.config import get_config

logger = logging.getLogger(__name__)

executor = ThreadPoolExecutor(max_workers=1)

def train(train_config_path):
    return executor.submit(TaskRunner(get_config(), train_config_path)).result()

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

        target = self.config["target"]
        logger.debug("Building container at: " + task_container_path + " for target: " + target)

        if self.config["target"].find("x86") == 0:
            target = "x86"

        dockerfile_path = "Dockerfile"
        if target.find("arm") == 0:
            dockerfile_path += ".arm"

        logs = self.low_level_docker_client.build(path=task_container_path,
            dockerfile=dockerfile_path, target=target,
            tag="trainer-container:latest", decode=True)

        for chunk in logs:
            if 'stream' in chunk:
                for line in chunk['stream'].splitlines():
                    logger.debug(line)

    def run(self):
        logger.debug("Running container on config path: " + self.train_config_path)
        container = self.docker_client.containers.run("trainer-container:latest", command=self.train_config_path, detach=True, volumes=
            {self.config["credentials"]["path"]: {'bind': '/root/.aws/credentials', 'mode': 'ro'},
             '/var/run/docker.sock': {'bind': '/var/run/docker.sock', 'mode': 'rw'}})

        for line in container.logs(stream=True):
            logger.debug(line)

