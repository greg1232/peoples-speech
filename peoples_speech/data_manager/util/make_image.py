
from smart_open import open

import os
import soundfile as sf
import matplotlib.pyplot as plt

import logging

logger = logging.getLogger(__name__)

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

    except:
        return False

