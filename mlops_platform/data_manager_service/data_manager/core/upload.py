
from smart_open import open
import jsonlines

from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.core.util.make_entry import make_entry

import logging

logger = logging.getLogger(__name__)

def upload(jsonlines_path):
    '''Takes a jsonlines file in s3 for a new dataset and inserts it into the data manager database.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    with open(jsonlines_path) as jsonlines_file:
        with jsonlines.Reader(jsonlines_file) as jsonlines_reader:
            for entry in jsonlines_reader:
                make_entry(database, entry)
