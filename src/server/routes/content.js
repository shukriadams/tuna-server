module.exports = {

    bind(app){
        
        const jsonHelper = require(_$+'helpers/json')

        /**
         * Gets a user's content, based on requestedContent. This is a , separted string. Note, tdoes not return songs, as that can crash the
         * server under high load. use /content/songs to get song data 
         */
        app.get('/v1/content/all/:requestedContent', async function(req, res){
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

        /**
         * Gets a user's songs. use ?page=INTEGER to specify a page
         */
        app.get('/v1/content/songs', async function(req, res){
            try {
                
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    settings = require(_$+'helpers/settings')
                    songsLogic = require(_$+'logic/songs'),
                    authToken = await authHelper.authenticate(req),
                    index = req.query.page ? parseInt(req.query.page) : 0,
                    pageSize = settings.songsPageSize,
                    songs = await songsLogic.getAll(authToken.profileId),
                    page = {
                        songs : songs.slice(index * pageSize, (index * pageSize ) + pageSize),
                        isEnd : songs.length <= index * pageSize
                    }

                jsonHelper.returnPayload(res, page)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
    }
}