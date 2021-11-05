from data_manager.support.database import Database
from data_manager.util.config import get_config

import logging

logger = logging.getLogger(__name__)

def setsplit(view, images, split_type):
    '''Assigns the split to a new type.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    results = get_results(database, view, images, config)

    for index, result in enumerate(results):
        if result["labeled"]:
            is_train = split_type == "train"
            result["train"] = is_train
            result["test"] = not is_train
            logger.debug("Updating " + result["audio_path"] + " is_train " + str(is_train))
            database.update(result, key=("audio_path", result["audio_path"]))

def get_results(database, view, images, config):

    logger.debug("Searching for view: " + str(view))
    logger.debug(" with images: " + str(images))

    view["selected"] = { "uid" : [] }

    for image in images:
        if image["selected"] > 0:
            view["selected"]["uid"].append(image["uid"])

    results = database.search(view)

    return results
