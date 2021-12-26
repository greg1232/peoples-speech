import collections
import os

import webrtcvad
from pydub import AudioSegment

from smart_open import open

import logging

logger = logging.getLogger(__name__)

class WebRTCSegmenter:
    def __init__(self, config):
        self.config = config

    def segment(self, audio_info):

        frames = get_frames(audio_info, self.config)

        segments = get_segments(frames, self.config)

        utterances = align_labels_to_segments(segments, audio_info)

        return {
            "label" : audio_info["label"],
            "utterances" : utterances
        }

def get_frames(result, config):
    with open(result["audio_path"], "rb") as audio_file:
        extension = os.path.splitext(result["audio_path"])
        audio = AudioSegment.from_file(audio_file, format=extension[1][1:])

        duration_in_milliseconds = len(audio)

        frame_size = int(config["alignment"]["vad"]["frame_duration_ms"])

        for i in range(0, duration_in_milliseconds, frame_size):
            begin = i
            end = i + frame_size

            if end > duration_in_milliseconds:
                break

            yield Frame(audio[begin:end], begin, end, audio.frame_rate)

def align_labels_to_segments(segments, result):
    all_segments = list(segments)

    utterances = []

    segment_count = len(all_segments)

    label_step = (len(result["label"]) + segment_count - 1) // (segment_count)

    logger.debug("Label step: " + str(label_step))
    logger.debug("Segment count: " + str(segment_count))

    for index, segment in enumerate(all_segments):
        start = index * label_step
        end = min((index + 1) * label_step, len(result["label"]))
        utterances.append({
            "confidence" : 0.0,
            "audio" : { "start" : segment[0].start, "end": segment[-1].end },
            "label" : result["label"][start:end],
            "speaker" : "Speaker 1"
        })

    return utterances


class Frame(object):
    """Represents a "frame" of audio data."""
    def __init__(self, segment, start, end, sample_rate):
        self.segment = segment
        self.start = start
        self.end = end
        self.sample_rate = sample_rate

def get_segments(frames, config):
    """Filters out non-voiced audio frames.
    Given a webrtcvad.Vad and a source of audio frames, yields only
    the voiced audio.
    Uses a padded, sliding window algorithm over the audio frames.
    When more than 90% of the frames in the window are voiced (as
    reported by the VAD), the collector triggers and begins yielding
    audio frames. Then the collector waits until 90% of the frames in
    the window are unvoiced to detrigger.
    The window is padded at the front and back to provide a small
    amount of silence or the beginnings/endings of speech around the
    voiced frames.
    Arguments:
    sample_rate - The audio sample rate, in Hz.
    frame_duration_ms - The frame duration in milliseconds.
    padding_duration_ms - The amount to pad the window, in milliseconds.
    vad - An instance of webrtcvad.Vad.
    frames - a source of audio frames (sequence or generator).
    Returns: A generator that yields PCM audio data.
    """
    padding_duration_ms = config["alignment"]["vad"]["padding_duration_ms"]
    frame_duration_ms = config["alignment"]["vad"]["frame_duration_ms"]
    voiced_frame_ratio =  config["alignment"]["vad"]["voiced_frame_ratio"]

    num_padding_frames = int(padding_duration_ms / frame_duration_ms)
    # We use a deque for our sliding window/ring buffer.
    ring_buffer = collections.deque(maxlen=num_padding_frames)
    # We have two states: TRIGGERED and NOTTRIGGERED. We start in the
    # NOTTRIGGERED state.
    triggered = False

    vad = webrtcvad.Vad()

    vad.set_mode(3)

    voiced_frames = []
    log_message = ""
    for frame in frames:
        data = frame.segment.raw_data
        logger.debug("Segment byte length: " + str(len(data)) + ", frame ms: " +
            str(len(frame.segment)) + ", frame rate: " + str(frame.sample_rate) +
            " data: " + str(data[0:10]) )
        is_speech = vad.is_speech(data, frame.sample_rate)

        log_message += ('1' if is_speech else '0')
        if not triggered:
            ring_buffer.append((frame, is_speech))
            num_voiced = len([f for f, speech in ring_buffer if speech])
            # If we're NOTTRIGGERED and more than X% of the frames in
            # the ring buffer are voiced frames, then enter the
            # TRIGGERED state.
            if num_voiced > voiced_frame_ratio * ring_buffer.maxlen:
                triggered = True
                log_message += ('+(%s)' % (ring_buffer[0][0].start,))
                # We want to yield all the audio we see from now until
                # we are NOTTRIGGERED, but we have to start with the
                # audio that's already in the ring buffer.
                for f, s in ring_buffer:
                    voiced_frames.append(f)
                ring_buffer.clear()
        else:
            # We're in the TRIGGERED state, so collect the audio data
            # and add it to the ring buffer.
            voiced_frames.append(frame)
            ring_buffer.append((frame, is_speech))
            num_unvoiced = len([f for f, speech in ring_buffer if not speech])
            # If more than X% of the frames in the ring buffer are
            # unvoiced, then enter NOTTRIGGERED and yield whatever
            # audio we've collected.
            if num_unvoiced > voiced_frame_ratio * ring_buffer.maxlen:
                log_message += ('-(%s)' % (frame.end))
                logger.debug(log_message)
                log_message=""

                triggered = False
                yield voiced_frames
                ring_buffer.clear()
                voiced_frames = []
    if triggered:
        log_message += ('-(%s)' % (frame.end))
        logger.debug(log_message)
    # If we have any leftover voiced audio when we run out of input,
    # yield it.
    if voiced_frames:
        yield voiced_frames


