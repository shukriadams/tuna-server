describe('helpers/sourceProvider/getImporter', ()=>{
    
    it('helpers/sourceProvider/getImporter::happy::gets dropbox importer', async () => {
        const ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'helpers/settings', {
            musicSource : constants.SOURCES_DROPBOX
        })

        const sourceProvider = require(_$+'helpers/sourceProvider'),
            importer = await await sourceProvider.getImporter() 

        ctx.assert.notNull(importer)
    })


    it('helpers/sourceProvider/getImporter::happy::gets nextcloud', async () => {
        const ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'helpers/settings', {
            musicSource : constants.SOURCES_NEXTCLOUD
        })

        const sourceProvider = require(_$+'helpers/sourceProvider'),
            importer = await await sourceProvider.getImporter() 

        ctx.assert.notNull(importer)
    })


    it('helpers/sourceProvider/getImporter::happy::gets s3', async () => {
        const ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'helpers/settings', {
            musicSource : constants.SOURCES_S3
        })

        const sourceProvider = require(_$+'helpers/sourceProvider'),
            importer = await await sourceProvider.getImporter() 

        ctx.assert.notNull(importer)
    })

    
    it('helpers/sourceProvider/getImporter::unhappy::handles invalid source', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'helpers/settings', {
            musicSource : 'an-invalid-source'
        })

        const sourceProvider = require(_$+'helpers/sourceProvider'),
            exception = await ctx.assert.throws(async() => await sourceProvider.getImporter() )

        ctx.assert.notNull(exception)
    })
})

