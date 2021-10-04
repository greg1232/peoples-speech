
from peoples_speech.support.database.tinydb_database_engine import TinyDBDatabaseEngine

class DatabaseEngineFactory:
    def __init__(self, config):
        self.config = config

    def create(self):
        if self.config["support"]["database"]["type"] == "tinydb":
            return TinyDBDatabaseEngine(self.config)

        assert False


