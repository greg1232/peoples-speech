
from data_manager.util.config import get_config
from data_manager.support.get_put_url import get_put_url
from data_manager.support.get_existing_file_hash import get_existing_file_hash

import os

import logging

logger = logging.getLogger(__name__)

def get_upload_url_for_file(file):
    '''Creates a url to upload a file to.'''

    config = get_config()

    path = os.path.join(config["data_manager"]["upload"]["path"], file["path"])

    logger.debug("Getting put url for path: " + str(path))

    url = get_put_url(path, config["support"]["get_url"]["expiration"])

    logger.debug(" url: " + str(url))

    existing_file_hash = get_existing_file_hash(path)

    logger.debug(" hash: " + str(existing_file_hash))

    return url, path, existing_file_hash

