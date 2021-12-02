
from smart_open import open

from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.core.util.make_entry import make_entry

from pydub import AudioSegment

import hashlib
import os
import json
import io

import logging

logger = logging.getLogger(__name__)

def submit_transcripts(utterances):
    '''Takes a list of labeled utterances and inserts them into the data manager.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    for utterance in utterances:
        new_utterance = extract_audio_segment(utterance)
        make_label(new_utterance)
        make_entry(database, new_utterance)

def extract_audio_segment(utterance):
    start = utterance["audio_info"]["start"]
    end   = utterance["audio_info"]["end"] + 500

    filename, extension = os.path.splitext(os.path.basename(utterance["audio_path"]))

    audio_filename = filename + "-" + str(start) + "-" + str(end) + extension

    new_audio_path = os.path.join(os.path.dirname(os.path.dirname(utterance["audio_path"])), "transcribed_audio", audio_filename)

    logger.debug("Extracting transcript for segment: " + new_audio_path + " <- " + utterance["audio_path"])

    with open(utterance["audio_path"], "rb") as audio_file:
        audio = AudioSegment.from_file(audio_file, format=extension[1:])

        audio_segment = audio[start:end]

        with open(new_audio_path, "wb") as new_file:
            with io.BytesIO() as temp_file:
                audio_segment.export(temp_file, format=extension[1:])

                new_file.write(temp_file.read())

    return {
        "audio_path" : new_audio_path,
        "label" : utterance["label"],
        "duration_ms" : end-start
    }

def make_label(utterance):
    hash_md5 = hashlib.md5()
    hash_md5.update(json.dumps(utterance["label"]).encode('utf-8'))

    label_path_base = os.path.join(os.path.dirname(os.path.dirname(utterance["audio_path"])), "new_labels")
    label_path = os.path.join(label_path_base, hash_md5.hexdigest() + ".json")

    utterance["label_path"] = label_path

    with open(utterance["label_path"], "w") as label_file:
        json.dump({"label" : utterance["label"]}, label_file)



