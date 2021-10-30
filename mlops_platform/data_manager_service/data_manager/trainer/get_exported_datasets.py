

from data_manager.support.database import Database
from data_manager.util.config import get_config

def get_exported_datasets():
    config = get_config()

    database = Database(config["data_manager"]["export"]["table_name"], config)

    return database.all()


