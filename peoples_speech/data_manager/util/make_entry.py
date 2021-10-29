from peoples_speech.data_manager.util.get_uid import get_uid
from peoples_speech.data_manager.util.make_image import make_image

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

    with open(new_path, "wb") as new_file:
        with io.BytesIO() as temp_file:
            audio.export(temp_file, format="flac")

            new_file.write(temp_file.read())

    entry["audio_path"] = new_path


