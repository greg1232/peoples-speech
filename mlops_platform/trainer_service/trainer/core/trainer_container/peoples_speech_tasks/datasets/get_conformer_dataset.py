'''
Copyright [2021] [Sudnya Diamos]
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
'''

import tensorflow as tf
import numpy as np

from tensorflow_asr.datasets.asr_dataset import ASRDataset

from smart_open import open
import logging
import json
import jsonlines

from tensorflow_asr.augmentations.augmentation import Augmentation
from tensorflow_asr.datasets.base_dataset import AUTOTUNE, BUFFER_SIZE, TFRECORD_SHARDS, BaseDataset
from tensorflow_asr.featurizers.speech_featurizers import (
    SpeechFeaturizer,
    load_and_convert_to_wav,
    read_raw_audio,
    tf_read_raw_audio,
)

from tensorflow_asr.featurizers import speech_featurizers, text_featurizers
from tensorflow_asr.utils import data_util, feature_util, file_util, math_util

from peoples_speech_tasks.models.conformer import get_conformer_config
from peoples_speech_tasks.util.get_local_file import get_local_file

logger = tf.get_logger()

def get_conformer_dataset(config, key):
    with get_conformer_config(config) as asr_config:

        text_featurizer = text_featurizers.SubwordFeaturizer(asr_config.decoder_config)
        speech_featurizer = speech_featurizers.TFSpeechFeaturizer(asr_config.speech_config)

        peoples_speech_dataset = PeoplesSpeechDataset(
            speech_featurizer=speech_featurizer,
            text_featurizer=text_featurizer,
            **vars(asr_config.learning_config.test_dataset_config)
        )

        tf_dataset = peoples_speech_dataset.create(config["model"]["batch_size"])

        return tf_dataset

def get_conformer_dataset_metadata(config, key):
    with open(config["dataset"]["path"]) as dataset_file:
        with jsonlines.Reader(dataset_file) as dataset_reader:
            for line in dataset_reader:
                if not line[key]:
                    continue

                yield line

class PeoplesSpeechDataset(ASRDataset):
    """Dataset for ASR using  PeoplesSpeech dataset. Contains jsonlines."""
    def read_entries(self):
        if hasattr(self, "entries") and len(self.entries) > 0:
            return
        self.entries = []
        for file_path in self.data_paths:
            logger.info(f"Custom read entries {file_path} ...")
            with tf.io.gfile.GFile(file_path, "r") as f:
                with jsonlines.Reader(f) as reader:
                    for entry in reader:
                        row = entry['audio_path'] + '\t' + str(entry["duration_ms"]) + '\t' + self.extract_label(entry['label_path'])
                        self.entries.append(row)

        # The files is "\t" seperated
        self.entries = [line.split("\t", 2) for line in self.entries]
        for i, line in enumerate(self.entries):
            self.entries[i][-1] = " ".join([str(x) for x in self.text_featurizer.extract(line[-1]).numpy()])

        self.entries = np.array(self.entries)
        if self.shuffle:
            np.random.shuffle(self.entries)  # Mix transcripts.tsv

        self.total_steps = len(self.entries)

    @staticmethod
    def load(record: tf.Tensor):
        def fn(path: bytes):
            with get_local_file(path.decode("utf-8")) as local_file_path:
                return load_and_convert_to_wav(local_file_path).numpy()

        audio = tf.numpy_function(fn, inp=[record[0]], Tout=tf.string)
        return record[0], audio, record[2]

    def create(self, batch_size: int):
        self.read_entries()
        if not self.total_steps or self.total_steps == 0:
            return None
        dataset = tf.data.Dataset.from_tensor_slices(self.entries)
        dataset = dataset.map(self.load, num_parallel_calls=AUTOTUNE)
        return self.process(dataset, batch_size)

    def extract_label(self, file_path):
        with open(file_path) as f:
            data = json.load(f)
            return '\"' + data['label'] + '\"'

