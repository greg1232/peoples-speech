
import peoples_speech

from flask import Flask, request
from flask_cors import CORS #comment this on deployment
import json
import os

app = Flask(__name__)
CORS(app) #comment this on deployment

import logging

logger = logging.getLogger(__name__)

@app.route('/peoples_speech/upload', methods=['GET', 'POST'])
def upload():
    logger.debug("Uploading audio data from: " + str(request.json))
    status = peoples_speech.upload(request.json["dataset_path"])
    return { "status" : status }

@app.route('/peoples_speech/export', methods=['GET', 'POST'])
def export():
    logger.debug("Exporting data with view: " + str(request.json))
    return { "status" : "ok"}

@app.route('/peoples_speech/autosplit', methods=['GET', 'POST'])
def autosplit():
    logger.debug("Splitting data with view: " + str(request.json))
    return { "status" : "ok"}

if __name__ == '__main__':
    peoples_speech.create_config()
    app.run(host='0.0.0.0')

