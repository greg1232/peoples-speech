
from smart_open import open
import jsonlines
import json
import os

import soundfile as sf
import matplotlib.pyplot as plt

from peoples_speech.support.database import Database
from peoples_speech.util.config import get_config

import hashlib

import logging

logger = logging.getLogger(__name__)

def upload(jsonlines_path):
    '''Takes a jsonlines file in s3 for a new dataset and inserts it into the data manager database.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    with open(jsonlines_path) as jsonlines_file:
        with jsonlines.Reader(jsonlines_file) as jsonlines_reader:
            for entry in jsonlines_reader:
                entry["train"] = False
                entry["test"] = False
                entry["uid"] = get_uid(entry["audio_path"])
                entry["labeled"] = len(entry["label_path"]) > 0
                with open(entry["label_path"]) as label_file:
                    entry["label"] = json.load(label_file)["label"]
                if not database.contains({"audio_path" : entry["audio_path"]}):
                    make_image(entry)
                    logger.debug("Inserted entry: " + str(entry))
                    database.insert(entry)

def get_uid(path):
    hash_md5 = hashlib.md5()
    hash_md5.update(path.encode("utf-8"))
    return hash_md5.hexdigest()

def make_image(entry):

    image_path = os.path.splitext(entry["audio_path"])[0] + ".png"

    entry["image_path"] = image_path

    if exists(image_path):
        logger.debug("Image exists: " + image_path + " ...")
        return

    with open(entry["audio_path"], "rb") as audio_file:
        audio_data, sample_rate = sf.read(audio_file)

    with open(image_path, "wb") as image_file:
        # plot the first 1024 samples
        plt.plot(audio_data)
        # label the axes
        plt.ylabel("Amplitude")
        plt.xlabel("Time")
        # set the title
        plt.title(os.path.split(entry["audio_path"])[1])
        # display the plot
        plt.savefig(image_file)
        plt.clf()

def exists(path):
    try:
        with open(path, "rb") as audio_file:
            return True

    except ValueError:
        return False

