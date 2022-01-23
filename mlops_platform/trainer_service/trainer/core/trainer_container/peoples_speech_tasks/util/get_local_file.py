import os
import tempfile
import contextlib
from smart_open import open

@contextlib.contextmanager
def get_local_file(config_path):
    _, ext = os.path.splitext(config_path)
    with tempfile.NamedTemporaryFile(suffix=ext) as tmp:
        buffer_size = 4096

        with open(config_path, "rb") as config_file:
            with open(tmp.name, "wb") as temp_file:
                data = config_file.read(buffer_size)

                while len(data) > 0:
                    temp_file.write(data)
                    data = config_file.read(buffer_size)

        yield tmp.name

