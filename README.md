# Backend API
## Local run
`cd api`

`python3 install pipenv`

`pipenv install`

`pipenv shell`

`export PYTHONPATH=~/Documents/github/letterjam/api`

`flask run` 

Check http://localhost:8000/api/status
## Docker run
`docker build --platform=linux/amd64 -t letterjam:latest .`

`docker run --name letterjam -d -p 8000:5000 --rm letterjam:latest`

## push to dockerhub
`docker login`

`docker tag letterjam arnehuang/letterjam:latest-amd64`

`docker push arnehuang/letterjam:latest-amd64`

## debug docker logs
`docker events&`

`docker run --name letterjam -d -p 8000:5000 letterjam:latest`

`docker container logs containeridhere`

## Push to heroku
`export DOCKER_DEFAULT_PLATFORM=linux/amd64`

`heroku container:push web -a letterjam-api`

`heroku container:release web -a letterjam-api`


# Frontend
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`

`nvm install 16`

`nvm use 16`

`npm --version`

`node --version`

`npm install`

`npm install --global yarn`

`yarn start`
