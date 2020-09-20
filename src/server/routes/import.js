module.exports = {

    bind(app){

        const jsonHelper = require(_$+'helpers/json')

        /** 
         * starts an import process
         */
        app.post('/v1/import', async function(req, res){
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