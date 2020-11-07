describe('sources/importerBase/_readIndices', ()=>{
    
    /**
     * 
     */
    it('sources/importerBase/_readIndices::unhappy::unimplemented', async () => {
        const ctx = require(_$t+'testcontext'),
            Importer = require(_$+'sources/importerBase'),
            importer = new Importer(),
            exception = await ctx.assert.throws( async() => await importer._readIndices() )

        ctx.assert.equal(exception, 'Not implemented')
    })
    
})

