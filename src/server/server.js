let Express = require('express'), // 160ms
    fs = require('fs-extra'),   // 77ms
    path = require('path'),     // 0ms
    bodyParser = require('body-parser'),    // 7ms
    pathingHelper = require(_$+'lib/pathing'),
    cache = require(_$+'lib/cache'),
    daemonManager = require(_$+'daemon/manager'),
    settings = require(_$+'lib/settings'),
    profilesLogic = require(_$+'logic/profiles'),
    interprocess = require(_$+'lib/interprocess'),
    mongoHelper = require(_$+'lib/mongo'),
    socketHelper = require(_$+'lib/socket'),
    sourceProvider = require(_$+'sources/provider'),
    routesHelper = require(_$+'lib/routes'),
    chaosHelper = require(_$+'lib/chaos'),
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
        chaosHelper.bind()
        
        if (settings.enableCrossProcessScripts)
            interprocess.initialize()

        // ensure mongo structures, this is required on first load
        mongoHelper.initialize()


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
        
        await routesHelper.bindRoutes(express)

        // start daemon after route binding, daemon can rely on routes
        daemonManager.startAll()

    }
}
