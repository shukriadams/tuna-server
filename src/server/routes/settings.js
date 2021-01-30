module.exports ={

    bind(app){

        const jsonHelper = require(_$+'helpers/json')

        /**
         * 
         */    
        app.get('/v1/settings', async function (req, res) {
            __log.info(`ROUTE:/v1/settings`)

            try {
                let sourceProvider = require(_$+'sources/provider'),
                    constants = require(_$+'types/constants'),
                    fs = require('fs-extra'),
                    settings = require(_$+'helpers/settings'),
                    source = sourceProvider.getSource(),
                    versionfile = { version : '0.0.0'}

                try {
                    versionfile = await fs.readJson('./version.json')
                } catch(ex){
                    __log.error(`failed to load version.json : ${ex}`)
                }

                jsonHelper.returnPayload(res, {
                    serverConstants : constants,
                    emailVerificationDeadlineHours : settings.emailVerificationDeadlineHours,
                    canConnectLastFM : !!settings.lastFmApiKey,
                    version : versionfile.version,
                    verbose : settings.verbose,
                    sourceLabel : source.getLabel()
                })

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
    }
}