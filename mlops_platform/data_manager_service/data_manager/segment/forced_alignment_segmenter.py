
from data_manager.util.config import config_to_dict

import align_speech

from smart_open import open
import json
from pydub import AudioSegment

from gruut import sentences

import logging

logger = logging.getLogger(__name__)

class ForcedAlignmentSegmenter:
    def __init__(self, config):
        self.config = config

    def segment(self, audio_info):
        segments = get_segments(audio_info)

        logger.debug("Aligning with config: " + str(self.config.as_dict()))

        aligned_utterances = align_speech.align(segments,
            user_config=config_to_dict(self.config))

        utterances = format_utterances(aligned_utterances)

        return {
            "label" : audio_info["label"],
            "utterances" : utterances
        }

def get_segments(audio_info):

    logger.debug("Getting segments from audio: " + str(audio_info))

    assert audio_info["labeled"]

    with open(audio_info["audio_path"], "rb") as audio_file:
        audio = AudioSegment.from_file(audio_file, "flac")

        with open(audio_info["label_path"]) as label_file:
            label = json.load(label_file)

            if "utterances" in label:
                for utterance in label["utterances"]:
                    yield { "audio" : audio,
                        "start" : utterance["audio_info"]["start"],
                        "end" : utterance["audio_info"]["end"],
                        "max_length" : len(audio),
                        "label" : utterance["label"] }
            else:
                splits = split_label(label["label"])

                for split in splits:
                    yield { "audio" : audio,
                        "start" : 0,
                        "end" : len(audio),
                        "max_length" : len(audio),
                        "label" : split }

def split_label(label):
    return [sentence.text for sentence in sentences(label)]

def format_utterances(utterances):
    formatted_utterances = []

    for utterance in utterances:
        formatted_utterances.append({
            "audio_info" : { "start" : utterance["start"], "end" : utterance["end"]},
            "label" : utterance["label"],
            "speaker" : "Speaker 1",
            "confidence" : utterance["confidence"]
        })

    return formatted_utterances

