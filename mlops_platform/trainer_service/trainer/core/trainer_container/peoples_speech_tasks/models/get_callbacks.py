
import tensorflow as tf

import logging

logger = logging.getLogger(__name__)

def get_callbacks(config):
    if config["model"]["type"] == "keyword":
        return [
            tf.keras.callbacks.EarlyStopping(verbose=1, patience=config["model"]["patience"]),
            tf.keras.callbacks.ModelCheckpoint(config["model"]["local_save_path"], save_best_only=True, verbose=1)
        ]
    elif config["model"]["type"] == "conformer":
        return [
            tf.keras.callbacks.EarlyStopping(verbose=1, patience=config["model"]["patience"]),
            tf.keras.callbacks.ModelCheckpoint(config["model"]["local_save_path"], save_best_only=True, save_weights_only=True, verbose=1)
        ]

    assert False, "Unknown model type: " + config["model"]["type"]

