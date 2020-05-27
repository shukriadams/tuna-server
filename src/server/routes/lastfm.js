const 
    jsonHelper = require(_$+'helpers/json'),
    authHelper = require(_$+'helpers/authentication'),
    contentHelper = require(_$+'helpers/content'),
    profileLogic = require(_$+'logic/profiles'),
    songsLogic = require(_$+'logic/songs')

module.exports = { 

    authHelper,

    profileLogic,
    
    songsLogic,

    bind(app){


        /**
         * todo : convert to DELETE
         */    
        app.get('/v1/lastfm/delete', async function (req, res) {
            try {
                const authToken = await authHelper.authenticate(req)

                await profileLogic.removeLastfm(authToken.profileId)

                const session = await contentHelper.build(authToken.profileId, authToken.id, 'profile')

                jsonHelper.returnPayload(res, session)
                
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Registers a play on lastfm
         */
        app.get('/v1/lastfm/scrobble', async function (req, res) {
            try {

                let authToken = await authHelper.authenticate(req)
           
                await songsLogic.scrobble(
                    authToken.profileId, 
                    req.query.song, 
                    req.query.songDuration)

                jsonHelper.returnPayload(res)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })

    }
}