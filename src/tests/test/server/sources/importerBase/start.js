describe('sources/importerBase/start', ()=>{
    
    it('sources/importerBase/start::happy::starts', async () => {
        let ctx = require(_$t+'testcontext'),
            called = false

        ctx.inject.object(_$+'helpers/cache', {
            add(){ }
        })

        ctx.inject.object(_$+'sources/provider', {
            getSource(){ 
                return {
                    ensureIntegration(){

                    }
                }
            }
        })

        ctx.inject.object(_$+'logic/songs', {
            getAll(){ return [] }
        })

        const Importer = require(_$+'sources/importerBase')
            importer = new Importer()

        // can't override class so do the instance of it instance
        importer = Object.assign(importer, {
            _updateIndexReferences(){ },
            _readIndices(){ },
            _processNextSong(){ 
                called = true
            }            
        })

        await importer.start()
        ctx.assert.true(called)
    })


    /**
     * For test coverage
     */
    it('sources/importerBase/start::unhappy::throws error', async () => {
        let ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'helpers/cache', {
            add(){ }
        })

        ctx.inject.object(_$+'sources/provider', {
            getSource(){ 
                throw 'some error'
            }
        })

        let Importer = require(_$+'sources/importerBase'),
            importer = new Importer()

        importer = Object.assign(importer, {
            inProgress(){ 
                return null
            }
        })
            
        const exception = await ctx.assert.throws(async() => await importer.start() )
        ctx.assert.equal(exception, 'some error')
    })


    /**
     * For teh test coveragez
     */
    it('sources/importerBase/start::unhappy::import in progress', async () => {
        let ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'helpers/cache', {
            add(){ }
        })

        ctx.inject.object(_$+'sources/provider', {
            getSource(){ 
                throw 'some error'
            }
        })

        let Importer = require(_$+'sources/importerBase'),
            importer = new Importer()

        importer = Object.assign(importer, {
            inProgress(){ 
                return {}
            }
        })
            
        const exception = await ctx.assert.throws(async() => await importer.start() ),  
            constants = require(_$+'types/constants')

        ctx.assert.equal(exception.code, constants.ERROR_IMPORT_IN_PROGRESS)
    })
})

