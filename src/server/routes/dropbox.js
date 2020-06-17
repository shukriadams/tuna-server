module.exports = { 

    bind (app){

        const jsonHelper = require(_$+'helpers/json')

        /**
         * todo : convert to DELETE
         */    
        app.get('/v1/dropbox/delete', async (req, res) => {
            try {
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    contentHelper = require(_$+'helpers/content'),
                    profileLogic = require(_$+'logic/profiles'),
                    authToken = await authHelper.authenticate(req)

                await profileLogic.deleteSource(authToken.profileId)

                const content = await contentHelper.build(authToken.profileId, authToken.id, 'profile')
                jsonHelper.returnPayload(res, content)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
    }
}