#!/bin/bash
pipenv install
pipenv run gunicorn -b :5000 --access-logfile - --error-logfile - api:app --chdir /home/letterjam