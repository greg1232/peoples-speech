from data_manager.core.util.get_uid import get_uid
from data_manager.core.util.make_image import make_image

from pydub import AudioSegment

from smart_open import open

import os
import json
import logging
import io

logger = logging.getLogger(__name__)

def make_entry(database, entry):
    convert_audio(entry)

    entry["train"] = False
    entry["test"] = False
    entry["duration_ms"] = get_duration_ms(entry["audio_path"])
    entry["uid"] = get_uid(entry["audio_path"])
    if "label_path" in entry:
        entry["labeled"] = len(entry["label_path"]) > 0
    else:
        entry["labeled"] = False
    if entry["labeled"]:
        with open(entry["label_path"]) as label_file:
            entry["label"] = json.load(label_file)["label"]
    else:
        entry["label"] = ""

    if not database.contains({"audio_path" : entry["audio_path"]}):
        make_image(entry)
        logger.debug("Inserted entry: " + str(entry))
        database.insert(entry)

    return entry

def convert_audio(entry):
    extension = os.path.splitext(entry["audio_path"])

    if extension[1] == ".flac":
        return

    new_path = entry["audio_path"] + ".flac"

    with open(entry["audio_path"], "rb") as audio_file:
        audio = AudioSegment.from_file(audio_file, format=extension[1][1:])
        audio.set_frame_rate(16000)
        audio.set_channels(2)

    with open(new_path, "wb") as new_file:
        with io.BytesIO() as temp_file:
            audio.export(temp_file, format="flac")

            new_file.write(temp_file.read())

    entry["audio_path"] = new_path

def get_duration_ms(audio_path):
    with open(audio_path, "rb") as audio_file:
        audio = AudioSegment.from_file(audio_file, format="flac")
        return len(audio)


