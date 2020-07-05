module.exports = {

    bind(app){
        
        const jsonHelper = require(_$+'helpers/json')

        /**
         * Gets a user's content, based on requestedContent. This is a , separted string
         */
        app.get('/v1/content/:requestedContent', async function(req, res){
            try {
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    contentHelper = require(_$+'helpers/content')
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