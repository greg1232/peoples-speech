

from peoples_speech.support.database import Database
from peoples_speech.util.config import get_config

def get_exported_datasets():
    config = get_config()

    database = Database(config["data_manager"]["export"]["table_name"], config)

    return database.all()


