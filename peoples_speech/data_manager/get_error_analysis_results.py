
from peoples_speech.support.database import Database
from peoples_speech.util.config import get_config
from peoples_speech.support.get_url import get_url

from smart_open import open
import json

import logging

logger = logging.getLogger(__name__)

def get_error_analysis_results(model):
    '''Selects model results for error analysis.'''

    config = get_config()

    database = Database(config["model_iteration"]["job_table_name"], config)

    logger.debug("Searching for model: " + str(model))

    model_job_infos = database.search({"model" : { "uid" : model }})

    if len(model_job_infos) <= 0:
        return { "images" : [] }

    model_job_info = model_job_infos[0]

    logger.debug("Got model info: " + str(model_job_info))

    results = load_model_results(model_job_info)

    images = [ {
        "url" : get_url(result["image_path"], config["support"]["get_url"]["expiration"]),
        "audio_url" : get_url(result["audio_path"], config["support"]["get_url"]["expiration"]),
        "uid" : result["uid"],
        "label" : result["label"],
        "prediction" : result["prediction"] }
        for result in results["error_analysis"] ]

    return { "images" : images }

def load_model_results(model_job_info):
    with open(model_job_info["results_path"]) as results_file:
        results = json.load(results_file)

    return results


