
from tensorflow_asr.featurizers import speech_featurizers, text_featurizers
from tensorflow_asr.configs.config import Config as ConformerConfig
from tensorflow_asr.models.transducer.conformer import Conformer
from tensorflow_asr.optimizers.schedules import TransformerSchedule
from tensorflow_asr.utils import file_util

import tensorflow as tf

def get_conformer_model(config, dataset):
    config = get_conformer_config(config)

    text_featurizer = text_featurizers.SubwordFeaturizer(config.decoder_config)
    speech_featurizer = speech_featurizers.TFSpeechFeaturizer(config.speech_config)

    conformer = Conformer(**config.model_config, vocabulary_size=text_featurizer.num_classes)
    conformer.make(
        speech_featurizer.shape,
        prediction_shape=text_featurizer.prepand_shape,
        batch_size=global_batch_size
    )
    conformer.load_weights(args.pretrained, by_name=True, skip_mismatch=True)

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
        experimental_steps_per_execution=1,
        global_batch_size=global_batch_size,
        blank=text_featurizer.blank
    )

    return conformer

def get_conformer_config(config):
    config_path = os.path.join(config["model"]["load_path"], "config.yml")

    conformer_config = file_util.load_yaml(config_path)

    return ConformerConfig(conformer_config)

