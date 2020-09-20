module.exports = {

    bind(app){

        const jsonHelper = require(_$+'helpers/json')
        
        /** 
         * Logs a song as now playing
         */
        app.post('/v1/playing', async function(req, res){
            try {
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    songsLogic = require(_$+'logic/songs')                
                    authToken = await authHelper.authenticate(req)

                await songsLogic.nowPlaying(authToken.profileId, req.body.song)

                jsonHelper.returnPayload(res)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
        
    }
}