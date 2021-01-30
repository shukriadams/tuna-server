let Express = require('express'), // 160ms
    fs = require('fs-extra'),   // 77ms
    path = require('path'),     // 0ms
    bodyParser = require('body-parser'),    // 7ms
    pathingHelper = require(_$+'helpers/pathing'),
    cache = require(_$+'helpers/cache'),
    daemon = require(_$+'helpers/daemon'),
    settings = require(_$+'helpers/settings'),
    profilesLogic = require(_$+'logic/profiles'),
    interprocess = require(_$+'helpers/interprocess'),
    mongoHelper = require(_$+'helpers/mongo'),
    socketHelper = require(_$+'helpers/socket'),
    sourceProvider = require(_$+'sources/provider'),
    express = null

module.exports = {

    /**
     * Creates and expose express for script that will be handling server
     */
    initialize(){
        express = Express()
        return express
    },


    /**
     * Initializes controllers/daemons. Requires httpServer passed in from script handling server
     */
    async start (httpServer){
        
        await fs.ensureDir(settings.dataFolder)
 
        if (settings.flushCacheOnStart)
            await cache.flush()
    
        sourceProvider.validateSettings()
        
        if (settings.enableCrossProcessScripts)
            interprocess.initialize()

        // ensure mongo structures, this is required on first load
        mongoHelper.initialize()

        daemon.start()

        socketHelper.initialize(httpServer)

        // generate the master user if it doesn't already exist
        await profilesLogic.autoCreateMaster()

        // routes all static content (css, js etc) requests to public folder. Note, this route will ideally not used when app is
        // hidden behind an nginx proxy front, as ngxin will directly handle static content 
        express.use(Express.static(path.join(pathingHelper.getExpressPath(), '/client')))
        express.use(Express.static(path.join(pathingHelper.getExpressPath(), '/public')))

        // add middleware before route handling
        express.use(bodyParser.urlencoded({ extended: false }))
        express.use(bodyParser.json({ limit : settings.maxJsonResponseSize }))
        
        let defaultRoute = null
            routeFiles = await fs.promises.readdir(path.join(__dirname, 'routes'))

        for (let routeFile of routeFiles){

            const name = routeFile.match(/(.*).js/).pop()
                routes = require(`./routes/${name}`)

            if (name === 'default'){
                defaultRoute = routes
                continue
            }

            await routes.bind(express)
        }

        // finally, load default route. This must be bound last because its pattern works
        // as a catchall for anything that isn't caught by a more specific fixed pattern.
        if (defaultRoute)
            await defaultRoute.bind(express)

    }
}
