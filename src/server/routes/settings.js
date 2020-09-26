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
                    sourceProvider = require(_$+'helpers/sourceProvider'),
                    constants = require(_$+'types/constants'),
                    settings = require(_$+'helpers/settings'),
                    source = sourceProvider.get(),
                    versionfile = await fs.readJson('./version.json')
                
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