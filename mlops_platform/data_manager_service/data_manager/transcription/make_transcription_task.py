from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.core.util.get_results import get_results

import time

import logging

logger = logging.getLogger(__name__)

def make_transcription_task(view, images):
    config = get_config()

    data_database = Database(config["data_manager"]["table_name"], config)

    results = get_results(data_database, view, images, config)

    database = Database(config["transcription"]["task_table_name"], config)

    for result in results:
        result["start_time"] = time.time()
        result["end_time"] = time.time()
        result["completion_percent"] = 0.0
        if not database.contains({"uid" : result["uid"]}):
            database.insert(result)

