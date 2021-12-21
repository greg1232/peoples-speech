
import os

def is_audio_file(path):
    return os.path.splitext(path)[1] == ".flac"

