module.exports = {

    bind(app){

        const jsonHelper = require(_$+'helpers/json')

        /**
         * Streams a song. This method does not enforce authentication with a header, it needs to be "anonymous" to 
         * resemble dropbox's, so we put the authoken in the url itself. It also returns a stream instead of JSON.
         */
        app.get('/v1/stream/:authToken/:mediaPath', async function (req, res) {
            try {
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    songsLogic = require(_$+'logic/songs'),
                    authToken = await authHelper.authenticateTokenString(req.params.authToken),
                    buffer = Buffer.from(req.params.mediaPath, 'base64'),
                    mediaPath = buffer.toString('ascii')

                await songsLogic.streamSong(authToken.profileId, mediaPath, res)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
        
    }
}