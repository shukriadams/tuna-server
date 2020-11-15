describe('logic/playlog', async()=>{

    it('logic/playlog/create::happy::creates a playlog', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'cache/playlog', {
            create (){
                return { id : 'some-id' }
            }
        })

        const logic = require(_$+'logic/playlog'),
            result = await logic.create()

        ctx.assert.equal(result.id, 'some-id')
    })

})