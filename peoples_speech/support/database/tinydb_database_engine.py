

from tinydb import TinyDB

class TinyDBDatabaseEngine:
    def __init__(self, config):
        self.config = config
        self.db = TinyDB(self.config["support"]["database"]["path"])

    def insert(self, entry):
        self.db.insert(entry)

