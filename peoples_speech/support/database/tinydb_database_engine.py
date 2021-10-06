

from tinydb import TinyDB, Query

class TinyDBDatabaseEngine:
    def __init__(self, config):
        self.config = config
        self.db = TinyDB(self.config["support"]["database"]["path"])

    def insert(self, entry):
        self.db.insert(entry)

    def search(self, view):

        query = view_to_query(view)

        return self.db.search(query)

    def contains(self, entry):
        query = Query().noop()

        for k, v in entry.items():
            query = query & (Query()[k] == v)

        return len(self.db.search(query)) > 0

def view_to_query(view):
    if len(view) == 0:
        return Query().noop()

    query = None

    for k, v in view.items():
        if query is None:
            query = Query()[k] == v
        else:
            query = query | (Query()[k] == v)

    return query


