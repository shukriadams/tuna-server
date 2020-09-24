# Tuna

Tuna lets you stream your music to any modern browser. It is open source and self-hosted, and can use any API-based storage platform like Dropbox, NextCloud or S3 to host your music.

## Requirements

- A modern HTML5 browser like FireFox, Chrome etc.
- An x64 Linux server with Docker (if you want to roll your own configuration you need NodeJS 10+ and MongoDB 3.x or higher)
- MP3, MP4 or Ogg Vorbis music files with valid ID3 tags for at least song, album and artist.
- A Dropbox/NextCloud account with enough space for your music files.  


## Setup

### App ID + secret

Tuna uses Oauth to access to your music on your storage platform. Both Dropbox and Nextcloud allow you to set up apps which can grant access, and you'll need to set one up first. Fortunately the process is relatively straightforward. 

- [Dropbox](https://www.dropbox.com/developers/apps/create)

#### NextCloud

When setting up your Oauth app in Nextcloud, you'll need to specify a callback URL. Use

    https://yourtunaurl.com/v1/oauth/nextcloud

- [Nextcloud](later)

### Server 

The following docker-compose script will set up everything you need to run a Tuna server.

    version: "2"
    services:
        mongo:
            image: mongo:latest
            container_name: tuna-mongo
            restart: unless-stopped
            environment:
                MONGO_INITDB_ROOT_USERNAME: admin
                MONGO_INITDB_ROOT_PASSWORD: mysqlpassword
            volumes:
                - ./mongo/data:/data/db:rw        
                - ./mongo/logs:/var/logs:rw        
        tuna:
            image: shukriadams/tuna-server:latest
            container_name: tuna-server
            restart: unless-stopped
            depends_on:
                - mongo
            volumes:
                - ./tuna:/usr/tuna/data/:rw
            environment:
                masterDefaultPassword : "myloginpassword"
                
                mongoConnectionString: "mongodb://admin:mysqlpassword@mongo:27017"
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

Change all passwords to something better. Note that this setup isn't ideal for security as passwords are stored in clear text, and you're connecting to Mongo as root, but it's "good enough" to get started.

Before starting you should create the local tuna volume folder and set its permission

    mkdir tuna
    chown 1000 -R tuna

### Index your music

Before you can start playing anything, Tuna needs to know what music you've got. To do this, you run a local program that scans your Dropbox/NextCloud folder for music and writes a local index file. [Download the Tuna Indexer](https://github.com/shukriadams/tuna-indexer/releases), install it, point it to your Dropbox or NextCloud folder and let it do its thing. If you're uncomfortable running the app and want to implement your onw, check the [developer docs](https://github.com/shukriadams/tuna-server/tree/master/docs).

### Logging in 

Tuna is a single-user system. It will automatically create a user for you. You have to supply a starting password when initializing your app, but once you log in, it is strongly recommended that you change that password to something that isn't stored in clear text.

When you log in, you'll be prompted to give access to either Dropbox or Nextcloud, follow the on-screen instructions. 

If you forget your password you can set a new one from the command line with 

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
