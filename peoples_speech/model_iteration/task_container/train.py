
from peoples_speech_tasks import get_dataset
from peoples_speech_tasks import get_model
from peoples_speech_tasks import get_config

import tensorflow as tf

import logging

logger = logging.getLogger(__name__)

def main():
    config = get_config()
    logger.debug("Loaded config: " + str(config))

    logger.debug("Loading dataset...")
    dataset = get_dataset(config)
    logger.debug("Dataset: " + str(dataset))

    logger.debug("Creating model...")
    model = get_model(config, dataset)

    model.summary()

    logger.debug("Training model...")
    model.fit(x=dataset,
        validation_data=dataset,
        verbose=2,
        epochs=config["model"]["epochs"],
        callbacks=tf.keras.callbacks.EarlyStopping(verbose=1, patience=2))

    logger.debug("Saving model...")
    model.save(config["model"]["save_path"])

if __name__ == "__main__":
    main()




