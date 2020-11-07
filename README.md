# Tuna

Tuna lets you stream your music to any modern browser. It is open source and self-hosted, and uses popular web-based storage platforms like Dropbox, NextCloud, S3 and similar to host music files. It also tries to focus on the player and the music library.

You can try out a [Tuna demo](https://tuna-demo.shukriadams.com/) - the username/password are `demo/demo`. Note that the server is running in readonly-mode so you will not be able to create playlists or change any config. It also plays random placeholder public domain music, and not the listed songs.

Tuna has no social media or sharing capabilities of any kind, though it does let you post play stats to [Last.fm](http://last.fm). It works in browsers only. A standalone Electron desktop player is planned, but not a mobile (Android/iOS) version.

## Requirements

- A modern HTML5 browser like FireFox, Chrome etc.
- An x64 Linux server with Docker (if you want to roll your own configuration you need NodeJS 10+ and MongoDB 3.x or higher)
- MP3, MP4 or Ogg Vorbis music files with valid ID3 tags for at least song, album and artist.
- A Dropbox/NextCloud account with enough space for your music files.  

## Setup

### App ID + secret

Tuna mainly uses Oauth to access your music. For sites like Dropbox and Nextcloud, this requires some administration work, as you'll need to set things up there before you can grant access to Tuna. Fortunately the process is relatively straightforward. 

#### Dropbox 

Visit the [Dropbox developers page](https://www.dropbox.com/developers/apps/create) to create an API application. 

Use the Oauth callback url `https://[yourtunaurl.com]/v1/oauth/dropbox` 

#### NextCloud

If you're using Nextcloud you'll need admin access to your Nextcloud server to manage your API. It's beyond the scope of this document to explain all this. 

Use the Oauth callback url `https://[yourtunaurl.com]/v1/oauth/nextcloud`

### Server 

Tuna is currently distributed via [Docker](https://hub.docker.com/repository/docker/shukriadams/tuna-server). Tuna does not build `latest` tags, so you'll need to visit this page to find a tag to use.

Use the following docker-compose script to quickly set up your Tuna instance.

    version: "2"
    services:
        mongo:
            image: mongo:[INSERT-TAG-HERE] 
            container_name: tuna-mongo
            restart: unless-stopped
            environment:
                MONGO_INITDB_ROOT_USERNAME: admin
                MONGO_INITDB_ROOT_PASSWORD: mysqlpassword
            volumes:
                - ./mongo/data:/data/db:rw        
                - ./mongo/logs:/var/logs:rw        
        tuna:
            image: shukriadams/tuna-server:[INSERT-TAG-HERE] 
            container_name: tuna-server
            restart: unless-stopped
            depends_on:
                - mongo
            volumes:
                - ./tuna:/usr/tuna/data/:rw
            environment:

                # username + password for Tuna website
                masterUsername : .........
                masterDefaultPassword : .........

                mongoConnectionString: "mongodb://admin:yourPasswordHere@mongo:27017"
                siteUrl: "https://yourtunaurl.com"

                # Allowed values are : nextcloud|dropbox
                musicSource : nextcloud 

                # if using dropbox, add your dropbox app id & secret here
                dropboxAppId: .........
                dropboxAppSecret: .........

                # if using nexcloud, add your nextcloud app host, id & secret here
                nextCloudHost: ........
                nextCloudClientId : .........
                nextCloudSecret: .........

            ports:
            - "48004:48004"


Change "yourPasswordHere" to something better. Before starting you should create the local tuna volume folder and set its permission

    mkdir tuna
    chown 1000 -R ./tuna

### Index your music

Tuna needs to know what music you've got in your Dropbox or NextCloud drive. To do this, you run a local program that scans your Dropbox/NextCloud folder for music and writes a local index file. [Download the Tuna Indexer](https://github.com/shukriadams/tuna-indexer/releases), install it, point it to your Dropbox or NextCloud folder and let it do its thing. If you're uncomfortable running the app and want to implement your own, check the [developer docs](https://github.com/shukriadams/tuna-server/tree/master/docs).

### Passwords

Tuna is a single-user system. It will automatically create a user for you. Once you log in, it is strongly recommended that you change your password. If you lose your password you can reset it from the command line with 

    docker exec -it tuna-server bash -c "cd /usr/tuna/scripts && node set --password YOURNEWPASSWORD"

## Advanced 

### Nginx and Socket.io

Tuna makes entensive use of websockets, if you're hosting it behind Nginx, you might have problems with this. Try adding the following to your Nginx config

    location / {
        proxy_pass http://localhost:YOUR-PORT-HERE; # add your own app port hehre
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

## License

Tuna is available under the GNU General Public License v3.0. See LICENSE for more 

## Developement

Please see /docs/development.md
