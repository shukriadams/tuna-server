# Tuna Developer docs

This a work in progress.

## Setup

This project is configured to work in Vagrant. After cloning the project start vagrant

    vagrant up
    vagrant ssh

You should be in the folder /vagrant/src, which is where you'll spend most of your time when developing on Tuna. _The path in the rest of this document are based on the assumption  you're in this folder._

 Install NodeJS packages with the following

    yarn --no-bin-links 
    npm rebuild node-sass --no-bin-links
    jspm install -y

You should always use yarn to install node modules, installing with npm will usually fail, likely because of a combination of this project's NodeJS version and some of the older packages used.

## Settings

All Tuna settings are environment variables. You can edit settings directly in _/src/server/helpers/settings.js_, but a better way is to create a settings override file @ _/src/.env_. This file is not committed to source control, and contains name=value pairs. You should add at least the following values to it

    musicSourceSandboxMode=true

This puts Tuna in sandbox mode.

### Sandbox Mode

Tuna can be run in sandbox mode, whereby it simulates Dropbox, Nextcloud and any other service it interacts with. Use this to develop and test locally without having to interact with those platforms. This is particularly useful for services like developer-unfriendly Nextcloud, which offers no convenient way to get dev auth tokens. 

When you import music in sandbox mode, Tuna will import song listings from the /src/server/reference/.tuna.xml file - in live mode, this file would normally be in the root of your Dropbox or NextCloud folder.

To stream music in sandbox box, add any mp3 songs to /src/music. Random songs will be streamed back.

#### Run

The easiest way to to run the project is

    node index

To start the dev environment with debugging enabled, live compile etc run

    cd /src
    npm run dev

If you want to force the app to wait until your debugger is attached use

    npm run dev -- --brk
    npm run dev -- --break

View at http://localhost:48004

A Visual Studio Code debug config for with Vagrant support is committed with project source, so if you start with the above you can debug immediately.

### Mongo 

Part of the dev tools includes a Mongo-express admin interface already running at http://localhost:49002

If you want to connect with your own mongo client, the dev Mongo database is exposed via http://localhost:49001

### Debug with Chrome

- on the host system, get the debug url with http://127.0.0.1:9222/json
- Post url in chrome, add break points and you're off

## Build

### Frontend only 

    sh ./build-frontend.sh

This is useful for testing Jspm & Sass bundling etc.

### Local docker build

To build a docker container image of your local code

    cd /vagrant/build
    sh ./build.sh

To test your container build locally

    docker-compose -f docker-compose-test.yml up -d

Open in browser from host machine

    http://localhost:58002


## Tests

To run all tests use

    npm test

To run all tests in the tests folder directly use

    cd tests
    ./../node_modules/mocha/bin/mocha --recursive

To run a single test use

    cd tests
    ./../node_modules/mocha/bin/mocha --recursive -g "test name"

or

    npm test -- -g "test name"

where "test name" can be either a group of tests as defined in 
 
    describe("group name") 
    
at the top of a test file, or an individual test's name in 

    it("test name")

To debug use

    npm run testdebug 
    npm run testdebug -- -g "test name" 

or

    cd tests
    ./../node_modules/mocha/bin/mocha --recursive --inspect-brk=0.0.0.0:48003
    ./../node_modules/mocha/bin/mocha --recursive --inspect-brk=0.0.0.0:48003 -g "test name"

## Concepts

### Playlist

- A playlist is a saved list of songs which can be added to the queue. 
- A user can have multiple playlists.
- Songs in a playlist must be added to the queue to play them. 
- Adding songs to the queue can either delete all existing songs in the queue, or append to the songs already in the queue.
- Playlists have a max size, this mainly for performance.

### Queue 

- The queue is a master list of songs which the player object uses to play music. 
- There is only one queue.
- When the queue runs out playing stops, or the use can loop the queue to play again from start.
- The queue shares the same max size with playlists.
- The queue can be be set to randomly grow - a new song will be added to it each time the last song is reached. New song selection can be based on settings that will be added later.

