
from peoples_speech.model_iteration.local_trainer import LocalTrainer

class TrainerFactory:
    def __init__(self, config, model_config):
        self.config = config
        self.model_config = model_config

    def create(self):
        if self.config["model_iteration"]["trainer"]["type"] == "local":
            return LocalTrainer(self.config, self.model_config)

        assert False



