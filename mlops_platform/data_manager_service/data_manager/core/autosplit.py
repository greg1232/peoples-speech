
import random

from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.core.util.get_results import get_results

import logging

logger = logging.getLogger(__name__)

def autosplit(view, images):
    '''Computes new train/test splits randomly.'''

    config = get_config()
    random.seed(config["data_manager"]["autosplit"]["seed"])

    database = Database(config["data_manager"]["table_name"], config)

    results = get_results(database, view, images, config)

    random.shuffle(results)

    for index, result in enumerate(results):
        if result["labeled"]:
            is_train = (index / len(results)) < (config["data_manager"]["autosplit"]["train_percent"] / 100.0)
            result["train"] = is_train
            result["test"] = not is_train
            logger.debug("Updating " + result["audio_path"] + " is_train " + str(is_train))
            database.update(result, key=("audio_path", result["audio_path"]))

