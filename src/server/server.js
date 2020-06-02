const 
    Express = require('express'),
    fs = require('fs-extra'),
    path = require('path'),
    bodyParser = require('body-parser'),
    pathingHelper = require(_$+'helpers/pathing'),
    cache = require(_$+'helpers/cache'),
    daemon = require(_$+'helpers/daemon'),
    settings = require(_$+'helpers/settings'),
    profilesLogic = require(_$+'logic/profiles'),
    interprocess = require(_$+'helpers/interprocess'),
    mongoHelper = require(_$+'helpers/mongo'),
    sourceProvider = require(_$+'helpers/sourceProvider'),
    express = Express()

module.exports = {
    // export underlying express so we can access it from tests
    express : express,

    /**
     * Initializes controllers/daemons.
     */
    async start (){
        
        await fs.ensureDir(settings.dataFolder)

        cache.initialize()

        if (settings.flushCacheOnStart)
            await cache.flush()
    
        sourceProvider.validate()
        
        if (settings.enableCrossProcessScripts)
            interprocess.initialize()

        mongoHelper.initialize()

        daemon.start()

        // generate the master user if it doesn't already exist
        await profilesLogic.autoCreateMaster(settings.masterUsername)

        // add middleware before route handling
        express.use(bodyParser.urlencoded({ extended: false }))
        express.use(bodyParser.json())
        
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

        // routes all static content (css, js etc) requests to public folder. Note, this route will ideally not used when app is
        // hidden behind an nginx proxy front, as ngxin will directly handle static content 
        express.use(Express.static(path.join(pathingHelper.getExpressPath(), '/client')))
        express.use(Express.static(path.join(pathingHelper.getExpressPath(), '/public')))
    }
}
