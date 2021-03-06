
from peoples_speech_tasks.datasets.get_dataset import get_dataset
from peoples_speech_tasks.datasets.get_dataset import get_dataset_metadata

import tensorflow as tf

import logging

logger = logging.getLogger(__name__)

def get_error_analysis(model, config):
    if config["model"]["type"] == "keyword":
        return get_keyword_error_analysis(model, config)
    elif config["model"]["type"] == "conformer":
        return get_conformer_error_analysis(model, config)

    assert False, "Not implemented"

def get_conformer_error_analysis(model, config):

    test_set = get_dataset(config, "test")

    scores = []
    for entry in test_set:
        score = model.evaluate(x=entry[0], y=entry[1])

        scores.append(score)
    logger.debug("Scores: " + str(scores))

    predictions = model.predict(test_set)
    logger.debug("Predictions: " + str(predictions))

    test_set_metadata = get_dataset_metadata(config, "test")

    error_analysis_results = []

    for index, metadata in enumerate(test_set_metadata):

        metadata["prediction"] = predictions[index][1].decode('UTF-8')
        metadata["label"] = metadata["label"]
        metadata["target_concept"] = config["model"]["label"]
        metadata["score"] = scores[index]

        logger.debug(str(metadata))

        error_analysis_results.append(metadata)

    return error_analysis_results

def get_keyword_error_analysis(model, config):

    test_set = get_dataset(config, "test")

    predictions = tf.nn.softmax(model.predict(test_set)).numpy()

    test_set_metadata = get_dataset_metadata(config, "test")

    error_analysis_results = []

    for index, metadata in enumerate(test_set_metadata):
        is_present = predictions[index, 1] > predictions[index, 0]

        metadata["prediction"] = config["model"]["label"] if is_present else "none"
        metadata["label"] = config["model"]["label"] if metadata["label"].find(config["model"]["label"]) != -1 else "none"
        metadata["target_concept"] = config["model"]["label"]
        metadata["score"] = float(predictions[index, 1])

        logger.debug(str(metadata))

        error_analysis_results.append(metadata)

    return error_analysis_results


