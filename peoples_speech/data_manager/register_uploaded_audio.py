
from peoples_speech.util.config import get_config
from peoples_speech.support.database import Database
from peoples_speech.data_manager.util.make_entry import make_entry

import os

import logging

logger = logging.getLogger(__name__)

def register_uploaded_audio(path):
    '''Creates a url to upload a file to.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    entry = make_entry(database, {"audio_path" : path})

    logger.debug("Getting entry for path: " + str(entry))

    return entry


