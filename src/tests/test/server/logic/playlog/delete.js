describe('logic/playlog', async()=>{

    it('logic/playlog/delete::happy::deletes a playlog', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'cache/playlog', {
            delete (){
                return { id : 'some-delete1' }
            }
        })

        const logic = require(_$+'logic/playlog'),
            result = await logic.delete()

        ctx.assert.equal(result.id, 'some-delete1')
    })

})