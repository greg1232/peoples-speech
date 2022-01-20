
import tensorflow as tf

import logging

logger = logging.getLogger(__name__)

def save_model(model, config):

    if config["model"]["type"] == "keyword":
        logger.debug("Loading best model from: " + config["model"]["local_save_path"])
        model = tf.keras.models.load_model(config["model"]["local_save_path"])

        logger.debug("Saving model to: " + config["model"]["save_path"])
        model.save(config["model"]["save_path"])
    elif config["model"]["type"] == "conformer":
        logger.debug("Loading best model from: " + config["model"]["local_save_path"])
        model.load_weights(config["model"]["local_save_path"])

        logger.debug("Saving model to: " + config["model"]["save_path"])
        model.save_weights(config["model"]["save_path"])
    else:
        assert False, "Unknown model type: " + config["model"]["type"]

