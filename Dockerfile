FROM python:3.9

RUN apt-get -yq update && apt-get install -yqq npm

WORKDIR /app/peoples_speech/react/speech-data-manager
COPY ./peoples_speech/react/speech-data-manager/package.json /app/peoples_speech/react/speech-data-manager/package.json
RUN npm install
RUN npm install @material-ui/core@next && npm install @emotion/react && npm install @emotion/styled

WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

COPY . /app

RUN chmod a+x /app/scripts/start-dev.sh

WORKDIR /app
ENTRYPOINT ["/app/scripts/start-dev.sh"]

