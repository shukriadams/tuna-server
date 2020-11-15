describe('sources/dropbox/importer/_updateIndexReferences', ()=>{

    it('sources/dropbox/importer/_updateIndexReferences::happy::updates indexes', async () => {
        
        let ctx = require(_$t+'testcontext'),
            Importer = require(_$+'sources/dropbox/importer')
            logged = false,
            constants = require(_$+'types/constants'),
            importer = new Importer()

        // classes can't be require-overridden, so monkeypatch
        importer = Object.assign(importer, {
            _getSource(){
                return {
                    profile : {},
                    source : {}
                }
            },
            profileLogic : {
                update(){ }
            },
            log : {
                create(){ 
                    // last call in target function servers as our test hook
                    logged = true 
                } 
            }
        })

        await importer._updateIndexReferences()
        ctx.assert.true(logged)
    })
})