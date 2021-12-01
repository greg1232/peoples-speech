
from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.support.get_url import get_url

from smart_open import open
import json

def get_transcription_utterances(uid):
    config = get_config()

    database = Database(config["transcription"]["task_table_name"], config)

    utterances = database.search({"tasks" : { "uid" : uid }})

    if len(utterances) <= 0:
        return []

    assert len(utterances) == 1

    segmented_utterances = []

    utterances[0]["speaker"] = "Speaker 1"
    utterances[0]["audio"] = get_url(utterances[0]["audio_path"], config["support"]["get_url"]["expiration"])
    utterances[0]["audio_info"] = { "start" : 0, "end" : 0 }

    if "label_path" in utterances[0]:
        with open(utterances[0]["label_path"]) as label_file:
            label = json.load(label_file)

            if "utterances" in label:
                for utterance in label["utterances"]:
                    segmented_utterance = utterances[0].copy()
                    segmented_utterance["label"] = utterance["label"]
                    segmented_utterance["speaker"] = utterance["speaker"]
                    segmented_utterance["audio_info"] = utterance["audio"]
                    segmented_utterances.append(segmented_utterance)
            else:
                segmented_utterances.append(utterances[0])

    else:
        utterances[0]["label"] = ""
        segmented_utterances.append(utterances[0])

    return segmented_utterances

