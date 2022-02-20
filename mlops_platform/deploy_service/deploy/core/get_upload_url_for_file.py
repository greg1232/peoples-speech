from deploy.util.config import get_config
from deploy.support.get_put_url import get_put_url

import os

import logging

logger = logging.getLogger(__name__)

def get_upload_url_for_file(file):
    '''Creates a url to upload a file to.'''

    config = get_config()

    path = os.path.join(config["deploy"]["upload"]["path"], file["path"])

    logger.debug("Getting put url for path: " + str(path))

    url = get_put_url(path, config["support"]["get_url"]["expiration"])

    logger.debug(" url: " + str(url))

    return url, path


