
from smart_open import open
import jsonlines
import os

import soundfile as sf
import matplotlib.pyplot as plt

from peoples_speech.support.database import Database
from peoples_speech.util.config import get_config

import logging

logger = logging.getLogger(__name__)

def upload(jsonlines_path):
    '''Takes a jsonlines file in s3 for a new dataset and inserts it into the data manager database.'''

    config = get_config()

    database = Database(config)

    with open(jsonlines_path) as jsonlines_file:
        with jsonlines.Reader(jsonlines_file) as jsonlines_reader:
            for entry in jsonlines_reader:
                entry["train"] = False
                entry["test"] = False
                entry["labeled"] = len(entry["label_path"]) > 0
                if not database.contains(entry):
                    make_image(entry)
                    logger.debug("Inserted entry: " + str(entry))
                    database.insert(entry)

def make_image(entry):
    with open(entry["audio_path"], "rb") as audio_file:
        audio_data, sample_rate = sf.read(audio_file)

    image_path = os.path.splitext(entry["audio_path"])[0] + ".png"

    with open(image_path, "wb") as image_file:
        # plot the first 1024 samples
        plt.plot(audio_data)
        # label the axes
        plt.ylabel("Amplitude")
        plt.xlabel("Time")
        # set the title
        plt.title(entry["audio_path"])
        # display the plot
        plt.savefig(image_file)

    entry["image_path"] = image_path

