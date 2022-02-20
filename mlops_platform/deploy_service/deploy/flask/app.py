
import deploy
import deploy.util.config

from flask import Flask, request
from flask_cors import CORS #comment this on deployment

app = Flask(__name__)
CORS(app) #comment this on deployment

import logging

logger = logging.getLogger(__name__)

@app.route('/peoples_speech/register_model', methods=['GET', 'POST'])
def register_model():
    logger.debug("Registering new model: " + str(request.json))
    deploy.register_model(request.json["path"])
    return { "status" : "ok" }

@app.route('/peoples_speech/predict', methods=['GET', 'POST'])
def predict():
    logger.debug("Running predict: " + str(request.json))
    prediction = deploy.predict(request.json["path"])
    return prediction

@app.route('/peoples_speech/get_devices', methods=['GET', 'POST'])
def get_devices():
    logger.debug("Getting deployment devices: " + str(request.json))
    devices = deploy.get_devices(request.json)
    return { "devices" : devices }

@app.route('/peoples_speech/get_metrics', methods=['GET', 'POST'])
def get_metrics():
    logger.debug("Getting deployment metrics: " + str(request.json))
    metrics = deploy.get_metrics(request.json)
    return { "metrics" : metrics }

@app.route('/peoples_speech/get_upload_url_for_file', methods=['GET', 'POST'])
def get_upload_url_for_file():
    logger.debug("Getting upload url for file for classification: " + str(request.json))
    url, path = deploy.get_upload_url_for_file(request.json["file"])
    return { "url" : url, "path" : path }

@app.route('/peoples_speech/register_uploaded_audio', methods=['GET', 'POST'])
def register_uploaded_audio():
    logger.debug("Getting upload url of file for classification: " + str(request.json))
    deploy.register_uploaded_audio(request.json["path"])
    return { "status" : "ok"}

if __name__ == '__main__':
    deploy.util.config.create_config()
    deploy.devices.initialize()
    deploy.devices.load_default_model()

    app.run(host='0.0.0.0', port=5002)


