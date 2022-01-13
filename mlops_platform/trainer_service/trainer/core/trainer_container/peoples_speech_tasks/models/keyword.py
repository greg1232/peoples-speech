import tensorflow as tf

import logging

logger = logging.getLogger(__name__)

def get_keyword_model(config, dataset):
    for spectrogram, _ in dataset.take(1):
        input_shape = spectrogram.shape
        logger.debug("Input shape: " + str(input_shape))

    logger.debug("Adapting normalizaion layer...")
    norm_layer = tf.keras.layers.Normalization()
    norm_layer.adapt(dataset.map(lambda x, _: x), steps=4)

    num_labels = 2

    model = tf.keras.models.Sequential([
        tf.keras.layers.Input(shape=input_shape[1:]),
        tf.keras.layers.Resizing(32, 32),
        norm_layer,
        tf.keras.layers.Conv2D(32, 3, activation='relu'),
        tf.keras.layers.Conv2D(64, 3, activation='relu'),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Dropout(0.25),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(num_labels),
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        metrics=['accuracy']
    )

    return model

