
from data_manager.support.database import Database
from data_manager.util.config import get_config

def get_transcription_tasks():

    config = get_config()

    database = Database(config["transcription"]["task_table_name"], config)

    return database.all()



