
from peoples_speech.support.database.tinydb_database_engine import TinyDBDatabaseEngine

class DatabaseEngineFactory:
    def __init__(self, table_name, config):
        self.config = config
        self.table_name = table_name

    def create(self):
        if self.config["support"]["database"]["type"] == "tinydb":
            return TinyDBDatabaseEngine(self.table_name, self.config)

        assert False


