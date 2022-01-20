
from peoples_speech_tasks import get_dataset
from peoples_speech_tasks import get_model
from peoples_speech_tasks import get_config
from peoples_speech_tasks import get_error_analysis
from peoples_speech_tasks import save_model
from peoples_speech_tasks import get_callbacks

import tensorflow as tf

import argparse
import os
import yaml
import json
import time
from smart_open import open

import logging

logger = logging.getLogger(__name__)

def main():
    parser = argparse.ArgumentParser(description=
        "Train a deep net on a dataset, producing a saved model.")
    parser.add_argument("config_path", default="", nargs='?',
                        help="The training config file to read from")

    args = vars(parser.parse_args())

    logger.error("Arguments: " + str(args))

    training_config = {}

    try:
        with open(args["config_path"]) as config_file:
            training_config = yaml.safe_load(config_file)

    except Exception as e:
        logger.error("Failed to load config file, using defaults.")
        logger.error(args["config_path"])
        logger.error(str(e))

    logger.debug("Loaded training config: " + str(training_config))

    config = get_config(training_config["model_iteration"]["trainer"])
    logger.debug("Loaded config: " + str(config))

    logger.debug("Loading training dataset...")
    train_dataset = get_dataset(config, "train")
    logger.debug("Training dataset: " + str(train_dataset))

    logger.debug("Loading test dataset...")
    test_dataset = get_dataset(config, "test")
    logger.debug("Test dataset: " + str(test_dataset))

    logger.debug("Creating model...")
    model = get_model(config, train_dataset)

    model.summary()

    logger.debug("Training model...")
    callbacks = get_callbacks(config)

    history = model.fit(x=train_dataset,
        validation_data=test_dataset,
        verbose=2,
        epochs=config["model"]["epochs"],
        callbacks=callbacks)
    history = history.history

    logger.debug("Training finished with history: " + str(history))

    save_model(model, config)

    logger.debug("Saving results to: " + config["model"]["results_path"])

    with open(config["model"]["results_path"], "w") as results_file:
        json.dump({"accuracy" : get_accuracy(history, config),
            "error_analysis" : get_error_analysis(model, config)}, results_file)

def get_accuracy(history, config):
    if config["model"]["type"] == "keyword":
        return float(max(history['val_accuracy']))
    else:
        return float(min(history['val_loss']))

if __name__ == "__main__":
    main()




