module.exports ={

    bind(app){

        const jsonHelper = require(_$+'helpers/json')

        /**
         * 
         */    
        app.get('/v1/settings', async function (req, res) {
            try {
                const 
                    sourceProvider = require(_$+'helpers/sourceProvider'),
                    constants = require(_$+'types/constants'),
                    settings = require(_$+'helpers/settings'),
                    source = sourceProvider.get()

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