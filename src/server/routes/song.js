module.exports = {

    bind(app){

        const jsonHelper = require(_$+'helpers/json')
            

        /**
         * Gets properties of a song. in this case specifically, we want the url it can be streamed from
         */    
        app.get('/v1/song/:id', async function (req, res) {
            __log.info(`ROUTE:/v1/song/${req.params.id}`)

            try {
                const authHelper = require(_$+'helpers/authentication'),
                    songsLogic = require(_$+'logic/songs'),
                    authToken = await authHelper.authenticate(req),
                    url = await songsLogic.getSongUrl(req.params.id, authToken.profileId, authToken.id)
        
                jsonHelper.returnPayload(res, { url })

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
        
    }
}