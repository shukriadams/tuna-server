const customEnv = require('custom-env'),          // 4ms
    process = require('process'),               // 1ms
    constants = require(_$+'types/constants'),
    settings = {

        // must match a SOURCE_* value from /types/constants
        musicSource : constants.SOURCES_DROPBOX,

        // base url of your site. Default is for dev environments, you NEED to change this when going live
        // Normally this will be something like 'https://mytuna.example.com', and will not include a port number.
        // Port is normally for local dev only.
        siteUrl : 'http://localhost:48004',

        // must always be set. will be automatically lowercased and trimmed when used
        masterUsername : null,

        // must be set when starting server, this will be the master password. Can be removed after starting the server
        // as it is not used again, unless you delete your user from the database. It is considered good practice to change
        // your password after setting it this way, so the password you use for realsies has never been written as plain text.
        masterDefaultPassword : null,

        // this must be set - 
        mongoConnectionString : 'mongodb://admin:secret@127.0.0.1:27017',

        // name of the database on Mongo server, don't change unless you really need to write to a different db
        mongoDBName : 'tuna',

        // if you're going to share a mongo database with other apps or Tuna instances (such as if running on Mongo Atlas), you can prevent
        // collision by setting this value to 'mytuna' or similar, which will be prefixed to all Tuna tables and indexes for this instance
        mongoCollectionPrefix : '',

        // port Express will listen on. You will normally not need to change this unless the port is clashing
        // with another app. 
        port : 48004,

        // interval the internal daemon runs at
        daemonInterval : '* * * * *',

        //
        importInterval : '* * * * *',

        // midnight
        eventLogPurgeInterval : '0 0 * * *', 

        // number of times to rety a standard external integration on error
        retriesOnConnectError : 3,

        // milliseconds to wait before retrying after error
        retryOnErrorWait : 200,

        bruteForceThreshold : 20,
        bruteForcePeriod : 15,
        bruteForceCooldown : 10,
        passwordLength : 12,
        maxSessionsPerUser : 3,
        songsPageSize: 10000,
        maxJsonResponseSize: '100k',

        // Settings this to true will disable all actions which can change data. This is used for public demonstration of Tuna
        demoMode : false,

        // this should always be true on production. Disable on dev systems for faster app start
        enableCrossProcessScripts : true,

        // true if minified file names should be used
        useMinifiedAssets : true,

        // refactor out
        indexDelay : null,
        flushCacheOnStart : true,
        autogeneratedPasswordFile : './.autogeneratedPassword',

        // folder tuna writes important values like auto generated passwords to. In a docker environment should always
        // be volume mounted
        dataFolder :'./data',
        logPath :'./data/logs',

        // if true loads js from bundle file. If false, main.js will load first
        // which will cascade load all other files.
        isJSBundled : true,

        // number of songs per bulk insert into database 
        importInsertBlockSize : 100,
        debounceInterval : 500, // millseconds per import update socket push

        // if true, play stats will be written to database
        logPlays : true,

        // in sanbox mode, place music files in this folder to get actual musis from looped-back calls
        musicSandboxFolder : './music',

        // if true, and a sandbox importer is available, will fallback to sandbox importer. This is for dev only
        // and will bypass true oauth in importer to use sandbox keys
        sandboxMode : false,

        dropboxAppId : null,
        dropboxAppSecret : null,

        // if set, and if system source is set to "dropbox", dropbox integration will be created automatically 
        dropboxOauthToken : null,

        lastFmApiKey : null,
        lastFmApiSecret : null,
        logLastFmResponses : false,

        s3key : null,
        s3secret : null,
        s3bucket : null,
        s3host : null,

        nextCloudClientId : null,
        nextCloudSecret : null,
        nextCloudHost : null,

        // Unlike lastfm and dropbox, nextcloud is an absolute secops paranoia-induced nightmare to code up against - you cannot
        // get dev tokens, all tokens expire regardless, and worst of all refresh tokens ALSO expire - if you fail to save 
        // a refreh token your integration will break and you will have to start the process from scratch. 
        // To get tokens : 
        // 1) use a browser to start an authorize flow on your nextcloud server, set redirect URL to a safe bogus url
        // 2) Copy the auth code from the url in your browser, immediately POST that back to nextcloud to swap code for tokens. 
        // 3) Copy the access + refresh tokens returned, paste them in here. 
        // 4) Start your "fake" nextcloud oauth flow in tuna, it will consume the tokens listed here.
        // 5) Tokens will then be managed and refreshed automatically by tuna, you can read files from nextcloud forever 
        //    or until the keys go out-of-sycc with nextcloud, at which point you'll need to repeat this process from step 1.
        // NOTE : once refreshed, you CANNOT use these tokens again, as they will be out-of-sync with nextcloud.
        nextCloudDevAccessToken : null,
        nextCloudDevRefreshToken : null,

        // these are standard Nextcloud oauth urls, you don't need to change them unless you know what you're doing
        nextCloudAuthorizeUrl : '/index.php/apps/oauth2/authorize',
        nextCloudTokenExchangeUrl : '/index.php/apps/oauth2/api/v1/token',
        nextCloudCodeCatchUrl : '/v1/oauth/nextcloud',

        // all email functionality is in limbo right now
        smtpUsername : null,
        smtpPassword : null,
        smtpHost: null,
        smtpPort: 587,
        fromEmail : 'no-reply@example.com',
        forceEmailVerification : false,
        emailVerificationDeadlineHours : 12,

        // enable for noisy logging
        verbose : false,
        
        enableBrowserCaching : true,

        enableChaos : false
    }


// apply custom .env settings - place an ".env" file in app root folder (where index.js/package.json) is
if (!process.env['IGNORE_DEV_ENV'])
    customEnv.env() 

// override defaults with env variables
for (const property in settings){
    if (!process.env[property])
        continue

    console.log(`Property ${property} set from env var`)
    
    settings[property] = process.env[property]

    // parse env bools
    if (settings[property] === 'true')
        settings[property] = true

    if (settings[property] === 'false')
        settings[property] = false
    
    // parse env integers
    if (Number.isInteger(settings[property]))
        settings[property] = parseInt(settings[property])
}

module.exports = settings