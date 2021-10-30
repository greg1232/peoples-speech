
from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.support.get_url import get_url

from smart_open import open
import jsonlines
import hashlib
import json
import os

import logging

logger = logging.getLogger(__name__)

def set_labels(view, images, label):
    '''Updates the labels of a set of images.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    results = get_results(database, view, images, config)

    logger.debug("Got database results: " + str(results))

    hash_md5 = hashlib.md5()

    hash_md5.update(label.encode('utf-8'))

    for result in results:
        label_path_base = os.path.join(os.path.dirname(os.path.dirname(result["audio_path"])), "new_labels")

        label_path = os.path.join(label_path_base, hash_md5.hexdigest() + ".json")
        logger.debug("Writing label to: " + str(label_path))

        with open(label_path, "w") as label_file:
            json.dump({"label" : label}, label_file)

        result["label"] = label
        result["label_path"] = label_path
        result["labeled"] = True

        database.update(result, key=("uid", result["uid"]))

def get_results(database, view, images, config):

    logger.debug("Searching for view: " + str(view))
    logger.debug(" with images: " + str(images))

    view["selected"] = { "uid" : [] }

    for image in images:
        if image["selected"] > 0:
            view["selected"]["uid"].append(image["uid"])

    results = database.search(view)

    return results


