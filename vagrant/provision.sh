#!/usr/bin/env bash
sudo apt-get update

sudo apt-get install git -y
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install nodejs  -y
sudo apt install docker.io -y
sudo apt install docker-compose -y
sudo usermod -aG docker vagrant

sudo npm install uglify-es -g
sudo npm install yarn -g
sudo npm install jspm@0.16x -g
sudo npm install minify@5.1.1 -g

# start dev containers
cd /vagrant/build
docker-compose -f docker-compose-dev.yml up -d 


# force startup folder to /src folder in project
echo "cd /vagrant/src" >> /home/vagrant/.bashrc

# set hostname, makes console easier to identify
sudo echo "tuna" > /etc/hostname
sudo echo "127.0.0.1 tuna" >> /etc/hosts

# add local dev url to hosts, this is to test nginx responses
sudo -- sh -c "echo 127.0.0.1 play.tuna.local >> /etc/hosts"
