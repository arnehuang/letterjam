#!/bin/bash
pipenv install

if test "${PORT+x}"
then
  echo "port is set"
  echo $PORT
else
  echo "setting port"
  export PORT=5000
fi

pipenv run gunicorn -b 0.0.0.0:$PORT --access-logfile - --error-logfile - api:app --chdir /home/letterjam
