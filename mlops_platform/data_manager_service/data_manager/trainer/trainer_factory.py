
from data_manager.trainer.remote_trainer import RemoteTrainer
from data_manager.trainer.null_trainer import NullTrainer

class TrainerFactory:
    def __init__(self, config, model_config):
        self.config = config
        self.model_config = model_config

    def create(self):
        if self.config["model_iteration"]["trainer"]["type"] == "remote":
            return RemoteTrainer(self.config, self.model_config)
        if self.config["model_iteration"]["trainer"]["type"] == "null":
            return NullTrainer(self.config, self.model_config)

        assert False



