from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.core.util.get_results import get_results
from data_manager.core.set_labels import set_labels

import requests

import logging

logger = logging.getLogger(__name__)

def auto_label(view, audios):
    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    results = get_results(database, view, audios, config)

    for result in results:
        logger.debug("Autolabeling: " + str(result))

        new_label = get_auto_label(result, config)

        set_labels(view, audios, {"label" : new_label})

def get_auto_label(result, config):
    response = requests.post(
        url=config["deploy"]["predict_endpoint"],
        json={"path" : result["audio_path"]})

    logger.debug("Got response from deploy service: " + str(response))

    return response.json()["label"]

