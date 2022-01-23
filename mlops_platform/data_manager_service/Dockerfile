FROM python:3.9 as base

RUN apt-get -yq update && \
    apt-get install -yqq npm && \
    apt-get install -yqq libsndfile1 && \
    apt-get install -yqq ffmpeg && \
    apt-get install -yqq curl

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

WORKDIR /app/data_manager
COPY ./requirements.txt /app/data_manager/requirements.txt
RUN pip install -r requirements.txt

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


