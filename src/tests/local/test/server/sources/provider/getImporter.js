describe('sources/provider/getImporter', ()=>{
    
    it('sources/provider/getImporter::happy::gets dropbox importer', async () => {
        const ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'lib/settings', {
            musicSource : constants.SOURCES_DROPBOX
        })

        const sourceProvider = require(_$+'sources/provider'),
            importer = await await sourceProvider.getImporter() 

        ctx.assert.notNull(importer)
    })


    it('sources/provider/getImporter::happy::gets nextcloud', async () => {
        const ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'lib/settings', {
            musicSource : constants.SOURCES_NEXTCLOUD
        })

        const sourceProvider = require(_$+'sources/provider'),
            importer = await await sourceProvider.getImporter() 

        ctx.assert.notNull(importer)
    })


    it('sources/provider/getImporter::happy::gets s3', async () => {
        const ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'lib/settings', {
            musicSource : constants.SOURCES_S3
        })

        const sourceProvider = require(_$+'sources/provider'),
            importer = await await sourceProvider.getImporter() 

        ctx.assert.notNull(importer)
    })

    
    it('sources/provider/getImporter::unhappy::handles invalid source', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'lib/settings', {
            musicSource : 'an-invalid-source'
        })

        const sourceProvider = require(_$+'sources/provider'),
            exception = await ctx.assert.throws(async() => await sourceProvider.getImporter() )

        ctx.assert.notNull(exception)
    })
})

