
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

    split_label = split_into_sentences(label, duration_limit)
    logger.debug("Split label: " + str(label))

    if len(split_label["utterances"]) < 2:
        return split_label

    grouped = []

    for previous, current in zip(split_label["utterances"][:-1], split_label["utterances"][1:]):
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

def split_into_sentences(label, duration_limit):
    split = []

    for utterance in label["utterances"]:
        sentences = utterance["label"].split(".")
        duration = utterance["audio_info"]["end"] - utterance["audio_info"]["start"]
        duration_step = duration / len(sentences)

        for index, sentence in enumerate(sentences):
            is_last = (index == len(sentences) - 1)
            start = utterance["audio_info"]["start"] + index * duration_step
            end = start + duration_step

            split_utterance = utterance.copy()
            split_utterance["label"] = sentence + ("." if is_last else "")
            split_utterance["audio_info"] = { "start" : start, "end" : end }

            if duration_step > duration_limit:
                split.extend(split_on_duration(split_utterance, duration_limit))
            else:
                split.append(split_utterance)

    return {
        "label" : label["label"],
        "utterances" : split
    }

def split_on_duration(utterance, duration_limit):
    split = []

    duration = utterance["audio_info"]["end"] - utterance["audio_info"]["start"]

    split_count = int(duration + duration_limit - 1) // int(duration_limit)
    split_size  = (len(utterance["label"]) + split_count - 1) // split_count

    sentences = chunks(utterance["label"], split_size)

    for index, sentence in enumerate(sentences):
        start = utterance["audio_info"]["start"] + index * duration_limit
        end = start + duration_limit

        split_utterance = utterance.copy()
        split_utterance["label"] = sentence
        split_utterance["audio_info"] = { "start" : start, "end" : end }

        split.append(split_utterance)

    return split

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def is_sentence(label):
    return label.split()[-1] == '.'

