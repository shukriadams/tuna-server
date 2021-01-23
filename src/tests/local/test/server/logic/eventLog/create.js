describe('logic/eventLog', async()=>{

    it('logic/eventLog/create::happy::creates an eventLog', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'cache/eventLog', {
            create (){
                return { id : 'some-id' }
            }
        })

        const logic = require(_$+'logic/eventLog'),
            result = await logic.create()

        ctx.assert.equal(result.id, 'some-id')
    })

})