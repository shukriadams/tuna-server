#!/usr/bin/env bash
sudo apt-get update

sudo apt-get install git -y
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install nodejs  -y
sudo apt install docker.io -y
sudo apt install docker-compose -y
sudo usermod -aG docker vagrant

sudo npm install uglify-es@3.3.9 -g
sudo npm install yarn -g
sudo npm install nyc@15.1.0 -g
sudo npm install jspm@0.16x -g
sudo npm install minify@5.1.1 -g


# start dev containers
cd /vagrant/build
docker-compose -f docker-compose-dev.yml up -d 

# install chromium, require by puppeteer
sudo apt-get install chromium-browser -y

# force startup folder to /src folder in project
echo "cd /vagrant/src" >> /home/vagrant/.bashrc

# set hostname, makes console easier to identify
sudo echo "tuna" > /etc/hostname
sudo echo "127.0.0.1 tuna" >> /etc/hosts

# add local dev url to hosts, this is to test nginx responses
sudo echo "127.0.0.1 play.tuna.local" >> /etc/hosts
