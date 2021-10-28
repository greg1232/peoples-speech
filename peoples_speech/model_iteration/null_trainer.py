
from smart_open import open
import yaml
import json
import jsonlines

import logging

logger = logging.getLogger(__name__)

class NullTrainer:
    def __init__(self, config, train_config_path):
        self.config = config
        self.train_config_path = train_config_path

        logger.warning("Using null trainer!")

    def launch(self):
        with open(self.train_config_path) as config_file:
            training_config = yaml.safe_load(config_file)

        logger.debug("Loaded config: " + str(training_config))

        logger.debug("Saving results to: " + training_config["model"]["results_path"])

        error_analysis = get_error_analysis(training_config)

        with open(training_config["model"]["results_path"], "w") as results_file:
            json.dump({"accuracy" : 0.0, "error_analysis" : error_analysis}, results_file)


def get_error_analysis(training_config):
    error_analysis = []

    for line in load_test_set(training_config):
        line["prediction"] = "null"
        error_analysis.append(line)

    return error_analysis

def load_test_set(training_config):
    with open(training_config["dataset"]["path"]) as dataset_file:
        with jsonlines.Reader(dataset_file) as dataset_reader:
            for line in dataset_reader:
                if not line["test"]:
                    continue

                yield line

