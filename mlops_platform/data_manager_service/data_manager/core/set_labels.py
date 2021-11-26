
from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.support.get_url import get_url
from data_manager.core.util.get_results import get_results

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
    transcription_database = Database(config["transcription"]["task_table_name"], config)

    results = get_results(database, view, images, config)

    logger.debug("Got database results: " + str(results))

    hash_md5 = hashlib.md5()

    hash_md5.update(json.dumps(label).encode('utf-8'))

    for result in results:
        label_path_base = os.path.join(os.path.dirname(os.path.dirname(result["audio_path"])), "new_labels")

        label_path = os.path.join(label_path_base, hash_md5.hexdigest() + ".json")
        logger.debug("Writing label to: " + str(label_path))

        with open(label_path, "w") as label_file:
            json.dump(label, label_file)

        result["label"] = label["label"]
        result["label_path"] = label_path
        result["labeled"] = True

        database.update(result, key=("uid", result["uid"]))

        update_transcription_database(transcription_database, result)

def update_transcription_database(transcription_database, result):

    tasks = transcription_database.search({ "data" : {"uid" : result["uid"]}})

    if len(tasks) == 0:
        return

    task = tasks[0]

    task.update(result)

    logger.debug("Updating result: " + str(task))
    transcription_database.update(task, key=("uid", result["uid"]))


