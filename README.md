*Git
sudo yum update -y
sudo yum install git -y

*Frontend
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
nvm install 12
nvm use 12
npm --version
node --version
npm install
npm install --global yarn
yarn start

sudo amazon-linux-extras install -y nginx1

 server {
	listen       3000;
    listen       [::]:3000;
    server_name  letterjam;
    root         /home/ec2-user/letterjam/build;
    index index.html;

    location /api {
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://localhost:5000;
    }


*Backend
cd api
python3 install pipenv
pipenv install
pipenv shell
cd ..
export PYTHONPATH=~/Documents/github/letterjam/api
yarn start-api
