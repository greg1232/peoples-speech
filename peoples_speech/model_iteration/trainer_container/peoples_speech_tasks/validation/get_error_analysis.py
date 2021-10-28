
from peoples_speech_tasks.datasets.get_dataset import get_dataset
from peoples_speech_tasks.datasets.get_dataset import get_dataset_metadata

import logging

logger = logging.getLogger(__name__)

def get_error_analysis(model, config):
    test_set = get_dataset(config, "test")

    predictions = model.predict(test_set)

    test_set_metadata = get_dataset_metadata(config, "test")

    error_analysis_results = []

    for index, metadata in enumerate(test_set_metadata):
        is_present = predictions[index, 1] > predictions[index, 0]

        metadata["prediction"] = config["model"]["label"] if is_present else ""

        logger.debug(str(metadata))

        error_analysis_results.append(metadata)

    return error_analysis_results


