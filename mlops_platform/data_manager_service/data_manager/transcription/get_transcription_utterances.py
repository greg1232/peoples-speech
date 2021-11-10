
from data_manager.support.database import Database
from data_manager.util.config import get_config

def get_transcription_utterances(uid):
    config = get_config()

    database = Database(config["transcription"]["task_table_name"], config)

    utterances = database.search({"tasks" : { "uid" : uid }})

    if len(utterances) <= 0:
        return []

    utterances[0]["speaker"] = "Speaker 1"

    return utterances

