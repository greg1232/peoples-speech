import hashlib
import json
import logging
import os
from smart_open import open

logger = logging.getLogger(__name__)

def set_label(database, entry, label):
    label_hash = get_label_hash(label)

    current_entry = get_current_entry(database, entry)

    updated_entry = update_entry(current_entry, label, label_hash)

    logger.debug("Updating entry: " + str(updated_entry))
    logger.debug("With label: " + str(label))

    database.update(updated_entry, key=("uid", updated_entry["uid"]))

def get_label_hash(label):
    hash_md5 = hashlib.md5()

    hash_md5.update(json.dumps(label).encode('utf-8'))

    return hash_md5.hexdigest()

def get_current_entry(database, entry):
    query = {}
    # prefer search by uid
    if "uid" in entry:
        query["uid"] = entry["uid"]
    elif "audio_path" in entry:
        # allow search by audio if not
        query["audio_path"] = entry["audio_path"]

    results = database.search({"query" : query})

    assert len(results) > 0

    if len(results) == 1:
        return results[0]

    # if there are multiple resuts, select one without labels
    for result in results:
        if not result["labeled"]:
            return result

    logger.debug("Entry: " + str(entry))
    logger.debug("Query: " + str(query))
    logger.debug("Found results: " + str(results))

    assert False, "Could not find unlabeled audio to apply label to"

def update_entry(entry, label, label_hash):
    label_path_base = os.path.join(os.path.dirname(os.path.dirname(
        entry["audio_path"])), "new_labels")

    label_path = os.path.join(label_path_base, label_hash + ".json")
    logger.debug("Writing label to: " + str(label_path))

    with open(label_path, "w") as label_file:
        json.dump(label, label_file)

    updated_entry = entry.copy()

    updated_entry["label"] = label["label"]
    updated_entry["label_path"] = label_path
    updated_entry["labeled"] = True

    return updated_entry

