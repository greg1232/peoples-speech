FROM python:3.9 as base

RUN apt-get -yq update && \
    apt-get install -yqq npm && \
    apt-get install -yqq libsndfile1

WORKDIR /app/peoples_speech/react/speech-data-manager
COPY ./peoples_speech/react/speech-data-manager/package.json /app/peoples_speech/react/speech-data-manager/package.json

# install react
RUN npm install

# Install material-ui
RUN npm install @material-ui/core@next && \
    npm install @emotion/react && \
    npm install @emotion/styled

RUN npm install @material-ui/icons@next
RUN npm install @material-ui/styles@next
RUN npm install @material-ui/lab@next

# Install react router
RUN npm install react-router-dom

# Install environment
RUN npm install env-cmd

# Install dropzone
RUN npm install react-dropzone

# Install peakjs
#RUN npm install peaks.js && \
#    npm install konva && \
#    npm install waveform-data

WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

RUN apt-get install -yqq ffmpeg

COPY . /app
WORKDIR /app

# Developement target
FROM base as development

RUN chmod a+x /app/scripts/start-dev.sh

ENTRYPOINT ["/app/scripts/start-dev.sh"]

# Staging target
FROM base as staging

RUN chmod a+x /app/scripts/start-staging.sh

ENTRYPOINT ["/app/scripts/start-staging.sh"]


