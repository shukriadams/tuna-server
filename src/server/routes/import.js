module.exports = {

    bind(app){

        const jsonHelper = require(_$+'lib/json')

        /** 
         * starts an import process
         */
        app.post('/v1/import', async function(req, res){
            __log.info(`ROUTE:/v1/import`)
            try {
                const authHelper = require(_$+'lib/authentication'),
                    sourceProvider = require(_$+'sources/provider'),
                    contentHelper = require(_$+'lib/content'),
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