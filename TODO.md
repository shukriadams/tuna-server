DONE
- clean up rest api
- remove all payment stuff
- dropbox must be set up personally
- move settings into .env file, and docker-compose files.
- need setting for max nr of accounts allowed.
- remove all profile.isVerified
- signup is disable, can run in single user mode only
- move all glu components into project
- push new content out with socket.io
- gpl2 license
- re-enable mongo table prefixing
- remove jquery
- replace jplayer with howler
- bring back linked mongo container
- move all npm build components into project
- mobile : move footer menu into main menu
- recreate howler instance on next play
- needs public player mode - disable profile page, disable profile actions, autologin
- allow setting default password via docker-compose
- remove API endpoints that don't return JSON
- replace sendgrid with smtp
- remove custom generated mongo ids, they're unnecessary
- remove all third party integrations
- display version on UI
- add support for streaming from an s3 bucket
- add internal play log for stats instead of relying on lastfm

TODO
- bug : updating songs breaks session
- dark theme!
- indexer : needs pause button
- indexer : show/hide on tray icon double click
- queue autofocus current song
- scrobbling should be done against a unique play instance instead of song id
- look at https://github.com/krateng/maloja as another scrobbling option
- add player test section - store local blob, play remote mp3/ogg/mp3, play local mp3/ogg/mp4
- local storage needs to be togglable
- last fm : rewrite to allow any public instance to be its own lastfm app.
- dragging requires one drag a song past the next sibling to activate
- write detailed import log so user can read through import history after the fact, instead of having to follow live
- unify oauth flow for all integrations, nextcloud and lastfm are still not routing to dev endpoints
- clean out old xmas tree code in lastfm and dropbox integrations
- unify the jsonHelper.payload strucutre that's returned to client
- add 2fa (look at speakeasy package)
- index should write date flag to separate flag that can be scanned rapidly to check if index been updated
- remove import page, replace with pop-under log
- move scrobble token to a "plugins" object
- search for "new Exception(invalid init args)"
- create pop-under log and remove all alerts on client. pop under should also be able to have links like "you should update your password - click HERE -> password page"
- test minimum hardware requirements
- build for raspberry pi aka ARM
- write setup guide, try to reduce complexity
- email : optional, smtp access required. needs email test.
- need way to force reset email from command line


## exceptions

- let all bubble up to API
- give them a unique code which is both public and private. this is an INT, and is mapped to an HTTP error code for exposing
- give optional public message, let the UI decide how to display them
- give them an internal exception, this NEVER escape API, and is always logged at the API

## User model

- This app supports one user only. To add more users, spin up new containers. To save on system resources, have multiple containers
share a single mongo database instance. I went with a single user model to reduce complexity - managing multiple users adds considerable extra complexity in the UI, and as I never intended this to be a massive user system, I decided to let this scale at the container level instead.
- when a container is first spun up, you must supply a username, this will be used to create the single user. 
- query the api to get the default password for this user, this must be entered at a special start login screen.
- Only a username and password are required. No email is ever sent.
- If you get locked out of a container, reset the password at the command line
- Songs can never be shared between users, that is by design, we encourage people to ethically source their own music, not legally, ethically. Support the artists you like, not because of laws, but because artists who make music you love deserve your love too. If you cannot source a song ethically, by all means, get it any way you want.

## What about social, sharing, music discovery etc?

This player was designed around the concept of private ownership and self-hosting first. The problem with sharing, social and music discovery is that currently, they are based on a business models where monopolies own our data and lock us into their platforms by dangling convenience infront of us. I would like to see music discovery built in a different way, where individuals can voluntarily push their metrics to whatever open data pools they choose, and get recommendations from a transparent algorithm. Discovery and stats aren't bad, I just want choice and transparency.


## Architecture concepts

- API is JSON, it should always return JSON, even on error.
- Pass error info past the API only if the user can response to them. else just say something has gone wrong, we'll look into it, log error at api and treat as bug.
- tests coverage is the main goal of testing
- a test on a given structure tests only the logic in that structure - all external structures are shimmed to be as simple as possible
- don't test obvious stuff, for egs we don't test if authentication works on all methods, we have a common auth helper that makes enforcing auth easy, we can visually verify if it's used in all methods, there is no need to write unit tests that double check this. Tests are mainly to ensure that all code is touched, and doesn't burst into flames on contact.
- all files export a class or object, and all exports expose internal dependencies so we can monkeypatch these for testing
- the app is a layer-cake, from top-down API > logic > cache > datalayer > database
- next to this stack are the helper classes, these can be called from anywhere.
- external music sources like dropbox and nextcloud will be treated as identical "oauth source plugins"
- direct access sources like S3 buckets are treated as "direct access plugins"
- lastfm and other metric systems are treated as "oauth plugins", and bind on events like "onSongPercentElapsed" or "onSongStarted" or "onSongCompleted"
- throw exceptions everwhere and let them bubble up to API. all exceptions must have a TYPE code which controls how it will be treated, optional "user" output can be attached if API should pass exception on to user


system-related, non-fatal
- trap at API
- write to system log
- alert admin
- soft warn user that system might be unstable

system-related, fatal
- trap at API
- write to system log
- alert admin
- redirect user to "fatal error" page in SPA

user-related
- user is NEVER an admin, admin access is via non-user pages only, never mix roles

user-related, user can correct
- pass through API
- return coded error from api, or send message via websocket
- trigger UI flow to fix error
- report success to user

user-relted, user can't fix
- pass through API
- return coded error from api, or send message via websocket
- show user a meaningful error message, without exposing internal exception, and ask them to contact admin



## website

mystream is a self-hosted web music player for people who want to control their own music. You host your own music (currently Dropbox and NextCloud are supported). You can play your music on any browser.

## History

mystream began as a startup prototype that never launched. It's been my main player for over a year, but I never finished it. I recently became active in the self-hosted scene, and wanted to contribute, so I dusted this off. That meant removing all "commercial" functionality, and cleaning up the awkard original code that was never intended for public viewing.

mystream was written around the way I like to consume music. I have a massive collection of MP3s that I stared in the 90's, based on a huge CD collection and DRM-free music bought off sites like Bandcamp. I don't like streaming services like Spotify because they underpay artists and don't have all the weird/old stuff I want.

## Tech 

mystream is a single-user player, written in NodeJS. It's intended to be mounted as a Docker container and runs on tiny VMs. It consumes very little resources, and is bandwidth effecient by caching music in the client. To cut down on complexity there is no user managament - spin up another container if you want to give a friend a player. To reduce server load you can multiple containers off a single MongoDB instance. 
