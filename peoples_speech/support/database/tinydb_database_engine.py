

from tinydb import TinyDB, Query

class TinyDBDatabaseEngine:
    def __init__(self, table_name, config):
        self.config = config
        self.db = TinyDB(self.config["support"]["database"]["path"])
        self.table = self.db.table(table_name)

    def insert(self, entry):
        self.table.insert(entry)

    def search(self, view):

        query = view_to_query(view)

        return self.table.search(query)

    def contains(self, entry):
        query = Query().noop()

        for k, v in entry.items():
            query = query & (Query()[k] == v)

        return len(self.table.search(query)) > 0

    def update(self, entry, key):
        query = Query()

        self.table.update(entry, query[key[0]] == key[1])

    def all(self):
        return self.table.all()

def view_to_query(view_group):
    if len(view_group) == 0:
        return Query().noop()

    query = None

    for k, view in view_group.items():

        local_query = None
        for k, v in view.items():
            if local_query is None:
                local_query = Query()[k] == v
            else:
                local_query = local_query | (Query()[k] == v)

        if query is None:
            query = local_query
        else:
            query = query & local_query

    return query


