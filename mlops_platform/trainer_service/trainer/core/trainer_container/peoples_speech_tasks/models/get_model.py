
from peoples_speech_tasks.models.conformer import get_conformer_model
from peoples_speech_tasks.models.keyword import get_keyword_model

def get_model(config, dataset):
    if config["model"]["type"] == "keyword":
        return get_keyword_model(config, dataset)
    if config["model"]["type"] == "conformer":
        return get_conformer_model(config, dataset)

    assert False
