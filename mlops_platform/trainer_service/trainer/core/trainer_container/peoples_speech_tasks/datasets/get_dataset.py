
from peoples_speech_tasks.datasets.get_keyword_dataset import get_keyword_dataset
from peoples_speech_tasks.datasets.get_keyword_dataset import get_keyword_dataset_metadata

from peoples_speech_tasks.datasets.get_conformer_dataset import get_conformer_dataset
from peoples_speech_tasks.datasets.get_conformer_dataset import get_conformer_dataset_metadata


def get_dataset(config, key):
    if config["model"]["type"] == "keyword":
        return get_keyword_dataset(config, key)
    elif config["model"]["type"] == "conformer":
        return get_conformer_dataset(config, key)

    assert False

def get_dataset_metadata(config, key):
    if config["model"]["type"] == "keyword":
        return get_keyword_dataset_metadata(config, key)
    elif config["model"]["type"] == "conformer":
        return get_conformer_dataset_metadata(config, key)

    assert False


