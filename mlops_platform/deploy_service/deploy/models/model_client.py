
from deploy.models.model_client_factory import ModelClientFactory

class ModelClient:
    def __init__(self, config):
        self.config = config
        self.client = ModelClientFactory(config).create()

    def load(self, path):
        return self.client.load(path)

    def predict(self, path):
        return self.client.predict(path)
