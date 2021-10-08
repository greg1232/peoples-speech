
from peoples_speech.support.database import Database
from peoples_speech.util.config import get_config
from peoples_speech.support.get_url import get_url

from smart_open import open
import jsonlines
import hashlib
import json
import os

import logging

logger = logging.getLogger(__name__)

def export(view):
    '''Exports a view from the dataset.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    logger.debug("Searching for view: " + str(view))

    results = database.search(view)

    logger.debug("Got database results: " + str(results))

    hash_md5 = hashlib.md5()

    for result in results:
        hash_md5.update(json.dumps(result).encode('utf-8'))

    dataset_path = os.path.join(config["data_manager"]["export"]["path"], hash_md5.hexdigest() + ".jsonlines")
    logger.debug("Writing exported dataset to: " + str(dataset_path))

    with open(dataset_path, "w") as dataset_file:
        with jsonlines.Writer(dataset_file) as jsonlines_writer:
            for result in results:
                jsonlines_writer.write(result)

    exported_database = Database(config["data_manager"]["export"]["table_name"], config)

    exported_database.insert({"id" : hash_md5.hexdigest(), "path" : dataset_path})

    return dataset_path

