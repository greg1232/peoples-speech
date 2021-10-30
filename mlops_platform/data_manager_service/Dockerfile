FROM python:3.9 as base

RUN apt-get -yq update && \
    apt-get install -yqq npm && \
    apt-get install -yqq libsndfile1

WORKDIR /app/data_manager
COPY ./requirements.txt /app/data_manager/requirements.txt
RUN pip install -r requirements.txt

RUN apt-get install -yqq ffmpeg

COPY . /app/data_manager
WORKDIR /app/data_manager

# Developement target
FROM base as development

RUN chmod a+x /app/data_manager/scripts/start-dev.sh

ENTRYPOINT ["/app/data_manager/scripts/start-dev.sh"]

# Staging target
FROM base as staging

RUN chmod a+x /app/data_manager/scripts/start-staging.sh

ENTRYPOINT ["/app/data_manager/scripts/start-staging.sh"]


