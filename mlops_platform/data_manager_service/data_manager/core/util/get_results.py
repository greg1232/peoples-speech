
import logging

logger = logging.getLogger(__name__)

def get_results(database, view, images, config):

    logger.debug("Searching for view: " + str(view))
    logger.debug(" with images: " + str(images))

    view["selected"] = { "uid" : [] }

    for image in images:
        if image["selected"] > 0:
            view["selected"]["uid"].append(image["uid"])

    results = database.search(view)

    return results
