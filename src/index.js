/**
 * Loads, starts and initializes the Tuna server. We separate the server from this the loader so we
 * can have multiple loaders - the mocha tester has its own loader so we can mount the server from tests.
 * 
 * Start your debugger on this file to launch a web server.
 */

// set shortcut global for easier module imports. Modules are loaded relative to "server" directory
global._$ = `${__dirname}/server/`;

const    
    http = require('http'),
    https = require('https'),
    tunaServer = require(_$+'server'),
    settings = require(_$+'helpers/settings'),
    socketHelper = require(_$+'helpers/socket'),
    certificateHelper = require(_$+'helpers/certificateHelper'),
    express = tunaServer.express;

(async function(){
    try {
        await tunaServer.start()

        let httpServer

        if (settings.useSelfSignedSSL) {
            const keys = await certificateHelper()
            httpServer = https.createServer({ key: keys.serviceKey, cert: keys.certificate }, express)
        } else
            httpServer = http.createServer(express)

        socketHelper.initialize(httpServer)

        httpServer.listen(settings.port, function () {
            console.log(`Tuna started, listening on port ${httpServer.address().port}`)
        })
        
    } catch(ex) {
        console.error(ex)
    }
})()
