
from tensorflow_asr.featurizers import speech_featurizers, text_featurizers
from tensorflow_asr.configs.config import Config as ConformerConfig
from tensorflow_asr.models.transducer.conformer import Conformer
from tensorflow_asr.optimizers.schedules import TransformerSchedule
from tensorflow_asr.utils import file_util
from peoples_speech_tasks.util.get_local_file import get_local_file

import tensorflow as tf
import os
import logging
import contextlib
import math

logger = logging.getLogger(__name__)

def get_conformer_model(global_config, dataset):
    with get_conformer_config(global_config) as config:

        text_featurizer = text_featurizers.SubwordFeaturizer(config.decoder_config)
        text_featurizer.decoder_config.beam_width = global_config["model"]["beam_width"]
        speech_featurizer = speech_featurizers.TFSpeechFeaturizer(config.speech_config)

        conformer = Conformer(**config.model_config, vocabulary_size=text_featurizer.num_classes)
        conformer.make(
            speech_featurizer.shape,
            prediction_shape=text_featurizer.prepand_shape,
            batch_size=global_config["model"]["batch_size"]
        )

        pretrained_path = os.path.join(global_config["model"]["load_path"], "latest.h5")
        with get_local_file(pretrained_path) as local_pretrained_path:
            conformer.load_weights(local_pretrained_path, by_name=True, skip_mismatch=True)

        optimizer = tf.keras.optimizers.Adam(
            TransformerSchedule(
                d_model=conformer.dmodel,
                warmup_steps=config.learning_config.optimizer_config.pop("warmup_steps", 10000),
                max_lr=(0.05 / math.sqrt(conformer.dmodel))
            ),
            **config.learning_config.optimizer_config
        )
        conformer.compile(
            optimizer=optimizer,
            steps_per_execution=1,
            global_batch_size=global_config["model"]["batch_size"],
            blank=text_featurizer.blank
        )

        conformer.add_featurizers(speech_featurizer, text_featurizer)

    return conformer

@contextlib.contextmanager
def get_conformer_config(config):
    config_path = os.path.join(config["model"]["load_path"], "config.yml")

    with get_local_file(config_path) as local_config_path:
        logger.debug("Local config path: " + local_config_path)
        conformer_config = file_util.load_yaml(local_config_path)

        conformer_config = ConformerConfig(conformer_config)

        with get_local_file(conformer_config.decoder_config["vocabulary"]) as local_vocabulary, \
            get_local_file(config["dataset"]["path"]) as local_dataset:
            logger.debug("Local vocab path: " + local_vocabulary)
            logger.debug("Local dataset path: " + local_dataset)
            conformer_config.decoder_config["vocabulary"] = local_vocabulary
            conformer_config.learning_config.test_dataset_config.data_paths = [local_dataset]

            yield conformer_config
