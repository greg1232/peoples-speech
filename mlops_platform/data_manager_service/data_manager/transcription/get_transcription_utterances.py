
from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.support.get_url import get_url

from smart_open import open
import json
import logging

logger = logging.getLogger(__name__)

def get_transcription_utterances(uid):
    config = get_config()

    task_database = Database(config["transcription"]["task_table_name"], config)

    tasks = task_database.search({"tasks" : { "uid" : uid }})

    if len(tasks) <= 0:
        return []

    assert len(tasks) == 1

    database = Database(config["data_manager"]["table_name"], config)

    data_items = database.search({"tasks" : {"uid" : tasks[0]["uid"]}})
    assert len(data_items) == 1

    data_item = data_items[0]

    segmented_utterances = []

    data_item["speaker"] = "Speaker 1"
    data_item["audio"] = get_url(data_item["audio_path"],
                                 config["support"]["get_url"]["expiration"])
    data_item["audio_info"] = { "start" : 0, "end" : 0 }

    if "label_path" in data_item:
        with open(data_item["label_path"]) as label_file:
            label = json.load(label_file)

            if "utterances" in label:
                for utterance in label["utterances"]:
                    segmented_utterance = data_item.copy()
                    segmented_utterance["label"] = utterance["label"]
                    segmented_utterance["speaker"] = utterance["speaker"]
                    segmented_utterance["audio_info"] = utterance["audio"]
                    segmented_utterances.append(segmented_utterance)
            else:
                segmented_utterances.append(data_item)

    else:
        data_item["label"] = ""
        segmented_utterances.append(data_item)

    logger.debug("Got transcription utterances: " + str(segmented_utterances))

    return segmented_utterances

