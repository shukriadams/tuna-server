# Developer docs

This a work in progress.

## Setup

This project is configured to work in Vagrant. After cloning the project

    # start vagrant
    cd /vagrant
    vagrant up
    vagrant ssh

    # start local mongo
    cd /vagrant/build
    docker-compose -f docker-compose-dev.yml up -d 

    cd /vagrant/src
    yarn --no-bin-links 
    npm rebuild node-sass --no-bin-links
    jspm install -y

You should always use yarn to install node modules, installing with npm fails.

### Run

The easiest way to to run the project is

    cd /src
    node index

To start the dev environment with debugging enabled, sass watching, server restarting etc, run

    cd /src
    npm run dev

Force app to wait for debugger with

    npm run dev -- --brk
    npm run dev -- --break

View at http://localhost:48004

Visual Studio Code debug config is committed with project source, so if you start with the above you can debug immediately.

### Mongo 

Part of the dev tools includes a Mongo-express admin interface already running at http://localhost:49002
If you want to connect with your own mongo client, the dev Mongo database is exposed via http://localhost:49001

### Debug Chrome

- on the host system, get the debug url with http://127.0.0.1:9222/json
- Post url in chrome, add break points and you're off

## Build

### Frontend only 

    cd /src
    ./build-frontend.sh

This is useful for testing Jspm & Sass bundling etc.

### Local docker build

To build a docker container image of your local code

    cd /build
    sh ./build.sh

To test your container build locally

    docker-compose -f docker-compose-test.yml up -d

Open in browser from host machine

    http://localhost:58002

## Sandbox Mode

Tuna can be run on sandbox mode, whereby it simulates Dropbox, Nextcloud and any other service it interacts with. Use this to develop and test on locally without having to interact with those platforms. This is particularly useful for services like developer-unfriendly platforms like Nextcloud, which offers no convenient way to get dev auth tokens.

### Music

To stream music in sandbox box, add any mp3 songs to /src/server/reference/music. Random songs will be streamed back.