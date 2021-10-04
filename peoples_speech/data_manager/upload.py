
from smart_open import open
import jsonlines

from peoples_speech.support.database import Database
from peoples_speech.util.config import get_config

import logging

logger = logging.getLogger(__name__)

def upload(jsonlines_path):

    config = get_config()

    database = Database(config)

    '''Takes a jsonlines file in s3 for a new dataset and inserts it into the data manager database.'''
    with open(jsonlines_path) as jsonlines_file:
        with jsonlines.Reader(jsonlines_file) as jsonlines_reader:
            for entry in jsonlines_reader:
                logger.debug("Loaded entry: " + str(entry))
                database.insert(entry)

