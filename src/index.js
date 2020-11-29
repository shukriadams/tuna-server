/**
 * Loads, starts and initializes the Tuna server. We separate the server from this the loader so we
 * can have multiple loaders - the mocha tester has its own loader so we can mount the server from tests.
 * 
 * Start your debugger on this file to launch a web server.
 * Perf : raw startup time (node index) is 3200 ms
 */

// set shortcut global for easier module imports. Modules are loaded relative to "server" directory
global._$ = `${__dirname}/server/`

// load first to speed up app loads. Note that all module lode times in comments are with cache enabled
require('cache-require-paths')

// use stopwatch to measure start time
const Stopwatch = require('statman-stopwatch'),
    stopwatch = new Stopwatch()

stopwatch.start()

const tunaServer = require(_$+'server'),          // 2000ms
    settings = require(_$+'helpers/settings'); // 12ms

(async ()=>{
    try {

        const express = tunaServer.initialize(),
            http = require('http'),
            httpServer = http.createServer(express)

        await tunaServer.start(httpServer) // 1200ms

        httpServer.listen(settings.port, ()=>{
            console.log(`Tuna Server started, source is ${settings.musicSource}. Listening on port ${httpServer.address().port}`)
            if (settings.sandboxMode)
                console.log(`Tuna is running in sandbox mode - all calls to external services will be shimmed internally.`)

            console.log(`Server started in ${Math.floor(stopwatch.read())} ms`)
        })
        
    } catch(ex) {
        console.error(ex)
    }
})()
