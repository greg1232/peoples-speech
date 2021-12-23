
from data_manager.support.database import Database
from data_manager.util.config import get_config
from data_manager.core.util.get_results import get_results
from data_manager.core.set_labels import set_labels
from data_manager.segment.segmenter_factory import SegmenterFactory

import logging

logger = logging.getLogger(__name__)

def auto_segment(view, images):
    '''Splits utterances into segments.'''

    config = get_config()

    database = Database(config["data_manager"]["table_name"], config)

    results = get_results(database, view, images, config)

    for index, result in enumerate(results):
        label = segment(result, config)

        logger.debug("segmented label: " + str(label))

        set_labels(view, images, label)

def segment(result, config):

    segmenter = SegmenterFactory(config).create()

    return segmenter.segment(result)

