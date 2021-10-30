FROM python:3.9 as base

RUN apt-get -yq update && \
    apt-get install -yqq npm && \
    apt-get install -yqq libsndfile1

WORKDIR /app/trainer
COPY ./requirements.txt /app/trainer/requirements.txt
RUN pip install -r requirements.txt

RUN apt-get install -yqq ffmpeg

COPY . /app/trainer
WORKDIR /app/trainer

# Developement target
FROM base as development

RUN chmod a+x /app/trainer/scripts/start-dev.sh

ENTRYPOINT ["/app/trainer/scripts/start-dev.sh"]

# Staging target
FROM base as staging

RUN chmod a+x /app/trainer/scripts/start-staging.sh

ENTRYPOINT ["/app/trainer/scripts/start-staging.sh"]


