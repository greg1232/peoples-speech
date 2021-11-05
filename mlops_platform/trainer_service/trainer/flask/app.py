
import trainer
import trainer.util.config

from flask import Flask, request
from flask_cors import CORS #comment this on deployment
import json
import os

app = Flask(__name__)
CORS(app) #comment this on deployment

import logging

logger = logging.getLogger(__name__)

@app.route('/remote_trainer/train', methods=['GET', 'POST'])
def train():
    logger.debug("Training new model remotely: " + str(request.json))
    model = trainer.train(request.json["path"])
    return { "model" : model}

if __name__ == '__main__':
    trainer.util.config.create_config()
    app.run(host='0.0.0.0', port=5555)

