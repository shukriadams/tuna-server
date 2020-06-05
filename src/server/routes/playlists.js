const jsonHelper = require(_$+'helpers/json')

module.exports = {

    bind(app){


        /**
         * Creates a playlist, returns updated usercontent
         */
        app.post('/v1/playlists', async function (req, res) {
            try {
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    contentHelper = require(_$+'helpers/content'),
                    playlistLogic = require(_$+'logic/playlists')                
                    authToken = await authHelper.authenticate(req),
                    playlist = req.body
            
                if (playlist.id)
                    await playlistLogic.update(playlist)
                else
                    await playlistLogic.create(playlist, authToken.profileId)
            
                const content = await contentHelper.build(authToken.profileId, authToken.id, 'playlists')

                jsonHelper.returnPayload(res, content)
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * 
         */    
        app.delete('/v1/playlists/:playlistId', async function (req, res) {
            try {
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    contentHelper = require(_$+'helpers/content'),
                    playlistLogic = require(_$+'logic/playlists')                
                    authToken = await authHelper.authenticate(req),
                    playlistId = decodeURIComponent(req.params.playlistId)
        
                await playlistLogic.delete(playlistId, authToken.profileId, authToken.id)

                const content = await contentHelper.build(authToken.profileId, authToken.id, 'playlists')

                jsonHelper.returnPayload(res, content)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })

    }
}