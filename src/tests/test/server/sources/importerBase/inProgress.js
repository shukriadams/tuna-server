describe('sources/importerBase/inProgress', ()=>{
    
    /**
     * 
     */
    it('sources/importerBase/inProgress::happy::gets progress', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'helpers/cache', {
            get(){ 
                return {}
            }
        })

        const Importer = require(_$+'sources/importerBase'),
            importer = new Importer(),
            inProgress = await importer.inProgress()

        ctx.assert.true(inProgress)
    })

    
    /**
     * 
     */
    it('sources/importerBase/inProgress::happy::no progress', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'helpers/cache', {
            get(){ 
                return null
            }
        })

        const Importer = require(_$+'sources/importerBase'),
            importer = new Importer(),
            inProgress = await importer.inProgress()

        ctx.assert.false(inProgress)
    })
    
})

