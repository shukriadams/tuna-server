describe('sources/importerBase/_updateIndexReferences', ()=>{
    
    /**
     * 
     */
    it('sources/importerBase/_updateIndexReferences::unhappy::unimplemented', async () => {
        const ctx = require(_$t+'testcontext')

        const Importer = require(_$+'sources/importerBase'),
            importer = new Importer(),
            exception = await ctx.assert.throws(async() => await importer._updateIndexReferences() )

        ctx.assert.equal(exception, 'Not implemented')
    })
    
})

