
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

    segmented_utterances = []

    data_item = {}

    data_item["audio_info"] = data_items[0]

    data_item["audio_info"]["audio"] = get_url(data_item["audio_info"]["audio_path"],
                                               config["support"]["get_url"]["expiration"])

    if "label_path" in data_item["audio_info"]:
        with open(data_item["audio_info"]["label_path"]) as label_file:
            label = json.load(label_file)

            if "utterances" in label:
                for utterance in label["utterances"]:
                    segmented_utterance = {
                        "audio_info" : data_item["audio_info"],
                        "utterance_info" : utterance
                    }
                    segmented_utterances.append(segmented_utterance)
            else:
                data_item["utterance_info"] = {
                    "confidence" : 0.0,
                    "speaker" : "Speaker 1",
                    "label" : label["label"],
                    "audio_info" : { "start" : 0, "end" : data_item["duration_ms"] }
                }

                segmented_utterances.append(data_item)

    else:
        data_item["utterance_info"] = {
            "confidence" : 0.0,
            "speaker" : "Speaker 1",
            "label" : "",
            "audio_info" : { "start" : 0, "end" : data_item["audio_info"]["duration_ms"] }
        }
        segmented_utterances.append(data_item)

    logger.debug("Got transcription utterances: " + str(segmented_utterances))

    return list(sorted(segmented_utterances, key=lambda x : x["utterance_info"]["confidence"]))

