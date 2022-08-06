FROM python:3.9-slim
RUN apt-get -y update
RUN apt-get -y install nano

RUN useradd letterjam

WORKDIR /home/letterjam
COPY api api
RUN chown -R letterjam:letterjam ./

WORKDIR /home/letterjam/api

RUN pip install pipenv
RUN chmod +x boot.sh

USER letterjam

ENV PYTHONPATH=/home/letterjam/api


EXPOSE 5000
ENTRYPOINT ["./boot.sh"]