FROM tensorflow/tensorflow:2.6.0 as x86

WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

COPY . /app

RUN chmod a+x /app/scripts/run.sh
ENTRYPOINT ["/app/scripts/run.sh"]

FROM arm64v8/ubuntu:20.04 as arm64

ENV PIP_EXTRA_INDEX_URL=https://snapshots.linaro.org/ldcg/python-cache/
RUN apt update -yqq && apt install -yqq python3 python3-pip
RUN apt install -yqq libmp3lame-dev

WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip --no-cache-dir install -r requirements.txt

COPY . /app

RUN chmod a+x /app/scripts/run.sh
ENTRYPOINT ["/app/scripts/run.sh"]
