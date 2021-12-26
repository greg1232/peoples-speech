
from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.support.get_url import get_url

from smart_open import open
import srt

import os
import json
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

def get_srt_url(uid):
    '''Generates an SRT file for the selected audio and returns a url to it.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    logger.debug("Searching for audio with uid: " + str(uid))

    results = database.search({"images" : { "uid" : uid }})

    logger.debug("Got database results: " + str(results))

    assert len(results) == 1

    path = make_srt(results[0])

    return get_url(path, config["support"]["get_url"]["expiration"])

def make_srt(audio_info):
    srt_path_base = os.path.join(os.path.dirname(os.path.dirname(
        audio_info["audio_path"])), "srt_transcripts")

    srt_path = os.path.join(srt_path_base, audio_info["uid"] + ".srt")
    logger.debug("Writing srt to: " + str(srt_path))

    subtitles = get_subtitles(audio_info)

    with open(srt_path, "w") as srt_file:
        srt_file.write(srt.compose(subtitles))

    return srt_path

def get_subtitles(audio_info):
    if not audio_info["labeled"]:
        return []

    with open(audio_info["label_path"]) as label_file:
        label = json.load(label_file)

    logger.debug("Loaded label: " + str(label))

    subtitles = []

    if len(label["utterances"]) == 0:
        start_time = timedelta(milliseconds=0)
        end_time = timedelta(milliseconds=audio_info["duration_ms"])
        subtitles.append(srt.Subtitle(index=0, start=start_time, end=end_time, content=label["label"]))

    for index, utterance in enumerate(label["utterances"]):
        start_time = timedelta(milliseconds=utterance["audio_info"]["start"])
        end_time = timedelta(milliseconds=utterance["audio_info"]["end"])
        subtitles.append(srt.Subtitle(index=index, start=start_time, end=end_time, content=utterance["label"]))

    return subtitles

