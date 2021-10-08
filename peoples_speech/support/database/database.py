
from peoples_speech.support.database.database_engine_factory import DatabaseEngineFactory

class Database:
    def __init__(self, table_name, config):
        self.config = config
        self.engine = DatabaseEngineFactory(table_name, config).create()

    def insert(self, entry):
        self.engine.insert(entry)

    def search(self, query):
        return self.engine.search(query)

    def contains(self, entry):
        return self.engine.contains(entry)

    def update(self, entry, key):
        return self.engine.update(entry, key)

    def all(self):
        return self.engine.all()


