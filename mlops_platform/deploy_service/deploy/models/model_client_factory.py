
from deploy.models.google_speech_api_client import GoogleSpeechAPIClient
from deploy.models.keyword_model_client import KeywordModelClient
from deploy.models.conformer_model_client import ConformerModelClient

class ModelClientFactory:
    def __init__(self, config):
        self.config = config

    def create(self):
        if self.config["deploy"]["model"]["type"] == "keyword":
            return KeywordModelClient(self.config)

        if self.config["deploy"]["model"]["type"] == "google":
            return GoogleSpeechAPIClient(self.config)

        if self.config["deploy"]["model"]["type"] == "conformer":
            return ConformerModelClient(self.config)

        assert False, "Unknown model type " + str(self.config)



