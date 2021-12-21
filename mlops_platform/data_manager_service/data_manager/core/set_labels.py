
from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.support.get_url import get_url
from data_manager.core.util.get_results import get_results
from data_manager.core.util.set_label import set_label

from smart_open import open
import os

import logging

logger = logging.getLogger(__name__)

def set_labels(view, images, label):
    '''Updates the labels of a set of images.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    results = get_results(database, view, images, config)

    logger.debug("Got database results: " + str(results))

    for result in results:
        set_label(database, result, label, config)


