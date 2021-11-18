
from deploy.util.config import get_config
from deploy.support.database import Database

from deploy.models.model_client import ModelClient

def register_model(model_path):
    config = get_config()

    client = ModelClient(config)

    client.load(model_path)

