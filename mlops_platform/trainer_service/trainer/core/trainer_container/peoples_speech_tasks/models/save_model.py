
import tensorflow as tf

from peoples_speech_tasks.models.conformer import get_conformer_config

from smart_open import open
import os

import logging

logger = logging.getLogger(__name__)

def save_model(model, config):

    if config["model"]["type"] == "keyword":
        logger.debug("Loading best model from: " + config["model"]["local_save_path"])
        model = tf.keras.models.load_model(config["model"]["local_save_path"])

        logger.debug("Saving model to: " + config["model"]["save_path"])
        model.save(config["model"]["save_path"])
    elif config["model"]["type"] == "conformer":
        logger.debug("Loading best model from: " + config["model"]["local_save_path"])
        model.load_weights(config["model"]["local_save_path"])

        logger.debug("Saving model to: " + config["model"]["save_path"])

        with get_conformer_config(config) as conformer_config:
            module = ConformerModule(model, conformer_config)

        model_path = os.path.join(config["model"]["save_path"], "best_saved_model")

        options = tf.saved_model.SaveOptions(experimental_custom_gradients=False)
        tf.saved_model.save(module, export_dir=model_path,
            signatures=module.pred.get_concrete_function(),
            options=options)

        config_path = os.path.join(config["model"]["load_path"], "config.yml")
        config_save_path = os.path.join(config["model"]["save_path"], "config.yml")

        with open(config_path) as input_config:
            with open(config_save_path, "w") as save_config:
                save_config.write(input_config.read())

    else:
        assert False, "Unknown model type: " + config["model"]["type"]

class ConformerModule(tf.Module):
    def __init__(self, model, config, name=None):
        super().__init__(name=name)
        self.model = model
        self.num_rnns = config.model_config["prediction_num_rnns"]
        self.rnn_units = config.model_config["prediction_rnn_units"]
        self.rnn_nstates = 2 if config.model_config["prediction_rnn_type"] == "lstm" else 1

    @tf.function(input_signature=[tf.TensorSpec(shape=[None], dtype=tf.float32)])
    def pred(self, signal):
        predicted = tf.constant(0, dtype=tf.int32)
        states = tf.zeros([self.num_rnns, self.rnn_nstates, 1, self.rnn_units], dtype=tf.float32)
        features = self.model.speech_featurizer.tf_extract(signal)
        encoded = self.model.encoder_inference(features)
        hypothesis = self.model._perform_greedy(encoded, tf.shape(encoded)[0], predicted, states, tflite=False)

        indices = self.model.text_featurizer.normalize_indices(hypothesis.prediction)
        upoints = tf.gather_nd(self.model.text_featurizer.upoints, tf.expand_dims(indices, axis=-1))  # [None, max_subword_length]

        num_samples = tf.cast(tf.shape(signal)[0], dtype=tf.float32)
        total_time_reduction_factor = self.model.time_reduction_factor * self.model.speech_featurizer.frame_step

        stime = tf.range(0, num_samples, delta=total_time_reduction_factor, dtype=tf.float32)
        stime /= tf.cast(self.model.speech_featurizer.sample_rate, dtype=tf.float32)

        etime = tf.range(total_time_reduction_factor, num_samples, delta=total_time_reduction_factor, dtype=tf.float32)
        etime /= tf.cast(self.model.speech_featurizer.sample_rate, dtype=tf.float32)

        non_blank = tf.where(tf.not_equal(upoints, 0))
        non_blank_transcript = tf.gather_nd(upoints, non_blank)
        non_blank_stime = tf.gather_nd(tf.repeat(tf.expand_dims(stime, axis=-1), tf.shape(upoints)[-1], axis=-1), non_blank)
        non_blank_etime = tf.gather_nd(tf.repeat(tf.expand_dims(etime, axis=-1), tf.shape(upoints)[-1], axis=-1), non_blank)

        return non_blank_transcript, non_blank_stime, non_blank_etime


