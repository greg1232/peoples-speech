
from deploy.util.config import get_config
from deploy.support.database import Database
from deploy.core.register_model import register_model

import platform

def initialize():
    create_local_device()
    initialize_metrics()

def create_local_device():
    config = get_config()

    database = Database(config["deploy"]["device_table_name"], config)

    if not database.contains({"name" : "local"}):
        database.insert({
            "name" : "local",
            "system" : platform.processor(),
            "model_name" : "none",
            "status" : "online"
        })

def initialize_metrics():
    config = get_config()

    database = Database(config["deploy"]["metrics_table_name"], config)

    if len(database.all()) == 0:
        database.insert({
            "count" : 0
        })

def load_default_model():
    config = get_config()
    register_model(config["deploy"]["model"]["path"])

