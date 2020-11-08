describe('logic/playlog', async()=>{

    it('logic/playlog/deleteAll::happy::deletes all playlogs', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'cache/playlog', {
            deleteAll (){
                return { id : 'some-delete' }
            }
        })

        const logic = require(_$+'logic/playlog'),
            result = await logic.deleteAll()

        ctx.assert.equal(result.id, 'some-delete')
    })

})