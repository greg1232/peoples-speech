FROM tensorflow/tensorflow:2.6.0-gpu

WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

COPY . /app

RUN chmod a+x /app/scripts/run.sh
ENTRYPOINT ["/app/scripts/run.sh"]
