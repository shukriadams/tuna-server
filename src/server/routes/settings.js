const
    jsonHelper = require(_$+'helpers/json'),
    sourceProvider = require(_$+'helpers/sourceProvider'),
    constants = require(_$+'types/constants'),
    settings = require(_$+'helpers/settings')

module.exports ={
    
    sourceProvider,

    bind(app){

        /**
         * 
         */    
        app.get('/v1/settings', async function (req, res) {
            try {
                let source = sourceProvider.get()

                jsonHelper.returnPayload(res, {
                    serverConstants : constants,
                    emailVerificationDeadlineHours : settings.emailVerificationDeadlineHours,
                    sourceLabel : source.getLabel()
                })

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
    }
}