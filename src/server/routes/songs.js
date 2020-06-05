const jsonHelper = require(_$+'helpers/json')

module.exports = {

    bind(app){

        /**
         * Gets the url a song can be streamed from.
         */    
        app.get('/v1/songs/url', async function (req, res) {
            try {
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    songsLogic = require(_$+'logic/songs')                
                    authToken = await authHelper.authenticate(req),
                    songId  = req.query.song,
                    url = await songsLogic.getSongUrl(songId, authToken.profileId, authToken.id)
        
                jsonHelper.returnPayload(res, { url })

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Streams a song. This method does not enforce authentication with a header, it needs to be "anonymous" to 
         * resemble dropbox's, so we put the authoken in the url itself. It also returns a stream instead of JSON.
         */
        app.get('/v1/songs/stream/:authToken/:mediaPath', async function (req, res) {
            try {
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    songsLogic = require(_$+'logic/songs')                
                    authToken = await authHelper.authenticateTokenString(req.params.authToken),
                    buffer = Buffer.from(req.params.mediaPath, 'base64'),
                    mediaPath = buffer.toString('ascii')
                
                await songsLogic.streamSong(authToken.profileId, mediaPath, res)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })

        
        /** 
         * Logs a song as now playing
         */
        app.post('/v1/songs/nowplaying', async function(req, res){
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


        /** 
         * starts an import process
         */
        app.post('/v1/songs/import', async function(req, res){
            try {
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    sourceProvider = require(_$+'helpers/sourceProvider'),
                    contentHelper = require(_$+'helpers/content'),
                    authToken = await authHelper.authenticate(req),
                    Importer = sourceProvider.getImporter(),
                    importer = new Importer(authToken.profileId, authToken.id)
                    
                await importer.start()
            
                const content = await contentHelper.build(authToken.profileId, authToken.id, 'songs,playlists,profile')
                jsonHelper.returnPayload(res, content)
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })    
        
    }
}