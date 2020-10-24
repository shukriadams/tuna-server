module.exports ={

    bind(app){

        const jsonHelper = require(_$+'helpers/json'),
            fs = require('fs-extra')

        /**
         * 
         */    
        app.get('/v1/settings', async function (req, res) {
            try {
                const 
                    sourceProvider = require(_$+'sources/provider'),
                    constants = require(_$+'types/constants'),
                    settings = require(_$+'helpers/settings'),
                    logger = require('winston-wrapper').instance(settings.logPath),
                    source = sourceProvider.getSource()

                let versionfile = { version : '0.0.0'}

                try {
                    versionfile = await fs.readJson('./version.json')
                } catch(ex){
                    logger.error.error(`failed to load version.json : ${ex}`)
                }

                jsonHelper.returnPayload(res, {
                    serverConstants : constants,
                    emailVerificationDeadlineHours : settings.emailVerificationDeadlineHours,
                    canConnectLastFM : !!settings.lastFmApiKey,
                    version : versionfile.version,
                    sourceLabel : source.getLabel()
                })

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
    }
}