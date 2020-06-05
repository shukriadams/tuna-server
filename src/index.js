/**
 * Loads, starts and initializes the Tuna server. We separate the server from this the loader so we
 * can have multiple loaders - the mocha tester has its own loader so we can mount the server from tests.
 * 
 * Start your debugger on this file to launch a web server.
 */

// set shortcut global for easier module imports. Modules are loaded relative to "server" directory
global._$ = `${__dirname}/server/`

const    
    tunaServer = require(_$+'server'),
    settings = require(_$+'helpers/settings');

(async ()=>{
    try {

        let 
            express = tunaServer.initialize(),
            httpServer = null

        if (settings.useSelfSignedSSL) {
            const 
                certificateHelper = require(_$+'helpers/certificateHelper'),
                https = require('https'),
                keys = await certificateHelper()

            httpServer = https.createServer({ key: keys.serviceKey, cert: keys.certificate }, express)
        } else {
            const http = require('http')
            httpServer = http.createServer(express)
        }

        await tunaServer.start(httpServer)

        httpServer.listen(settings.port, ()=>{
            console.log(`Tuna started, listening on port ${httpServer.address().port}`)
        })
        
    } catch(ex) {
        console.error(ex)
    }
})()
