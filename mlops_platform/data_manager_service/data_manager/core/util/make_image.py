

from data_manager.support.does_file_exist import does_file_exist

from smart_open import open

import os
import soundfile as sf
import matplotlib.pyplot as plt

import logging

logger = logging.getLogger(__name__)

def make_image(entry):

    image_path = os.path.splitext(entry["audio_path"])[0] + ".png"

    entry["image_path"] = image_path

    if does_file_exist(image_path):
        logger.debug("Image exists: " + image_path + " ...")
        return

    logger.debug("Making waveform image for: " + image_path)

    with open(entry["audio_path"], "rb") as audio_file:
        with sf.SoundFile(audio_file) as sound_file:
            frames = sound_file.frames
            read_frames = min(1024, frames)
            audio_data = sound_file.read(frames=read_frames)

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


