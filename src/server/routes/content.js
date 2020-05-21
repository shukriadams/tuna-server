const 
    jsonHelper = require(_$+'helpers/json'),
    authHelper = require(_$+'helpers/authentication'),
    sourceProvider = require(_$+'helpers/sourceProvider'),
    profileLogic = require(_$+'logic/profiles'),
    contentHelper = require(_$+'helpers/content')

module.exports = {

    sourceProvider,
    authHelper,

    bind(app){


        /**
         * Gets a user's content, based on requestedContent. This is a , separted string
         */
        app.get('/v1/content/:requestedContent', async function(req, res){
            try {
                const 
                    authToken = await authHelper.authenticate(req),
                    requestedContent = req.params.requestedContent.split(','),
                    content = await contentHelper.build(authToken.profileId, authToken.id,  requestedContent)

                jsonHelper.returnPayload(res, content)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
        
    }
}