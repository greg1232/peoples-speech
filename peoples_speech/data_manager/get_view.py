
from peoples_speech.support.database import Database
from peoples_speech.util.config import get_config
from peoples_speech.support.get_url import get_url

import logging

logger = logging.getLogger(__name__)

def get_view(view):
    '''Selects appropriate images from the database.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    logger.debug("Searching for view: " + str(view))

    results = database.search(view)

    logger.debug("Got database results: " + str(results))

    images = [ {
        "url" : get_url(result["image_path"], config["support"]["get_url"]["expiration"]),
        "uid" : result["uid"] }
        for result in results ]

    return { "images" : images }



