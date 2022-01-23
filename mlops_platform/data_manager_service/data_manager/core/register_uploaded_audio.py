
import os
import srt

import logging

from data_manager.util.config import get_config
from data_manager.support.database import Database
from data_manager.support.does_file_exist import does_file_exist
from data_manager.core.util.make_entry import make_entry
from data_manager.core.util.is_audio_file import is_audio_file
from data_manager.core.util.set_label import set_label

from smart_open import open

logger = logging.getLogger(__name__)

def register_uploaded_audio(audio_path):
    '''Creates a url to upload a file to.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    if is_audio_file(audio_path):
        entry = make_entry(database, {"audio_path" : audio_path}, config)

        logger.debug("Getting entry for path: " + str(entry))

        subtitle_path = os.path.splitext(audio_path)[0] + ".srt"

        if does_file_exist(subtitle_path):
            update_utterances(audio_path, subtitle_path, database)
    else:
        subtitle_path = audio_path
        entry = update_subtitle(subtitle_path, database)

    return entry

def update_subtitle(subtitle_path, database):
    '''Adds the subtitles to the audio file with the same name.'''

    audio_path = os.path.splitext(subtitle_path)[0] + ".flac"
    converted_audio_path = os.path.splitext(subtitle_path)[0] + "-converted.flac"

    if (not does_file_exist_in_database(database, audio_path)
        and not does_file_exist_in_database(database, converted_audio_path)):
        return

    update_utterances(audio_path, subtitle_path, database)

def update_utterances(audio_path, subtitle_path, database):
    utterances = []

    with open(subtitle_path) as subtitle_file:
        for utterance in srt.parse(subtitle_file):
            start = int(utterance.start.total_seconds() * 1000)
            end   = int(utterance.end.total_seconds() * 1000)
            utterances.append({
                "confidence" : 0.0,
                "speaker" : "Speaker 1",
                "label" : utterance.content,
                "audio_info" : { "start" : start, "end" : end }
            })

    label = {
        "label" : "",
        "utterances" : utterances
    }

    # handle converted files
    logger.debug("Checking for existance of audio path to update: " + audio_path)
    if does_file_exist_in_database(database, audio_path):
        set_label(database, {"audio_path" : audio_path}, label)
    else:
        converted_audio_path = os.path.splitext(audio_path)[0] + "-converted.flac"
        logger.debug("Checking for existance of converted audio path to update: " + converted_audio_path)
        assert does_file_exist_in_database(database, converted_audio_path)

        set_label(database, {"audio_path" : converted_audio_path}, label)

def does_file_exist_in_database(database, audio_path):
    return database.contains({"audio_path" : audio_path})


