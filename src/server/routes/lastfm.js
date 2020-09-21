module.exports = { 

    bind(app){

        const jsonHelper = require(_$+'helpers/json')

        /**
         * Removes lastfm integration
         */    
        app.delete('/v1/lastfm', async function (req, res) {
            try {
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    contentHelper = require(_$+'helpers/content'),
                    profileLogic = require(_$+'logic/profiles'),
                    authToken = await authHelper.authenticate(req)

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
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    songsLogic = require(_$+'logic/songs'),
                    authToken = await authHelper.authenticate(req)
           
                const scrobbled = await songsLogic.scrobble(
                    authToken.profileId, 
                    req.query.song, 
                    req.query.songDuration)

                jsonHelper.returnPayload(res, { scrobbled })

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })

    }
}