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

*Backend
cd api
python3 install pipenv
pipenv install
pipenv shell
cd ..
yarn start-pi
