

from peoples_speech.support.database import Database
from peoples_speech.util.config import get_config

def get_training_jobs():

    config = get_config()

    database = Database(config["model_iteration"]["job_table_name"], config)

    return database.all()


