
from smart_open import open

def does_file_exist(path):
    try:
        with open(path, "rb") as audio_file:
            return True

    except:
        return False

