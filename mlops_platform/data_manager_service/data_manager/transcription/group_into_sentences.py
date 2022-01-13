
from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.core.util.get_results import get_results
from data_manager.core.util.set_label import set_label

from smart_open import open

import json
import logging

logger = logging.getLogger(__name__)

def group_into_sentences(view, audios):
    '''Splits utterances into segments.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    results = get_results(database, view, audios, config)

    for index, audio in enumerate(results):
        if not audio["labeled"]:
            logger.debug("skipping unlabeled audio: " + str(audio))
            continue

        label = group_utterances_into_sentences(audio, config)

        logger.debug("grouped label: " + str(label))

        set_label(database, audio, label)

def group_utterances_into_sentences(audio, config):

    with open(audio["label_path"]) as label_file:
        label = json.load(label_file)

    duration_limit = 15e3

    grouped = []

    for previous, current in zip(label["utterances"][:-1], label["utterances"][1:]):
        previous_duration = (previous["audio_info"]["end"] - previous["audio_info"]["start"])
        current_duration = (current["audio_info"]["end"] - current["audio_info"]["start"])
        exceeds_duration_limit = previous_duration + current_duration >= duration_limit

        if is_sentence(previous["label"]) or exceeds_duration_limit:
            grouped.append(previous)
        else:
            current["audio_info"]["start"] = previous["audio_info"]["start"]
            current["label"] = previous["label"] + '\n' + current["label"]

    grouped.append(current)

    return {
        "label" : audio["label"],
        "utterances" : grouped
    }

def is_sentence(label):
    return label.split()[-1] == '.'

