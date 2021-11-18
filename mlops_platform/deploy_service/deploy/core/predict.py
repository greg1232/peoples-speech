
from deploy.util.config import get_config
from deploy.support.database import Database

from deploy.models.model_client import ModelClient

import logging

logger = logging.getLogger(__name__)

def predict(image_path):
    config = get_config()

    client = ModelClient(config)

    result = client.predict(image_path)

    database = Database(config["deploy"]["metrics_table_name"], config)

    count = database.has_field("count")

    logger.debug("Search results for count: " + str(count))

    count = count[0]

    database.update({"count" : count["count"] + 1}, ("count", count["count"]))

    return result
