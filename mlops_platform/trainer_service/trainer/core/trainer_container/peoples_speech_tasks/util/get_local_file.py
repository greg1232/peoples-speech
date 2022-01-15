import os
import tempfile
import contextlib
from smart_open import open

@contextlib.contextmanager
def get_local_file(config_path):
    _, ext = os.path.splitext(config_path)
    with tempfile.NamedTemporaryFile(suffix=ext) as tmp:
        with open(config_path, "rb") as config_file:
            with open(tmp.name, "wb") as temp_file:
                temp_file.write(config_file.read())

        yield tmp.name

