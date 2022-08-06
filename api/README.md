#Docker run
`docker build --platform=linux/amd64 -t letterjam:latest .`

`docker run --name letterjam -d -p 8000:5000 --rm letterjam:latest`

# push to dockerhub
`docker login`

`docker tag letterjam arnehuang/letterjam:latest-amd64`

`docker push arnehuang/letterjam:latest-amd64`

# local run

`pipenv shell`

`export PYTHONPATH=~/Documents/github/letterjam/api`

`flask run` 

localhost:8000/api/status

#debug docker logs
`docker events&`

`docker run --name letterjam -d -p 8000:5000 letterjam:latest`

`docker container logs containeridhere`






