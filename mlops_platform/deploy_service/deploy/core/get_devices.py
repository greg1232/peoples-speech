
from deploy.support.database import Database
from deploy.util.config import get_config

def get_devices(params):

    config = get_config()

    database = Database(config["deploy"]["device_table_name"], config)

    return database.all()


