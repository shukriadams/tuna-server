describe('logic/profiles/update', async()=>{

    it('logic/profiles/update::happy::updates profile', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'logic/profiles', {
            update (profile){
                return profile
            }
        })

        const logic = require(_$+'logic/profiles'),
            properties = await logic.update({ id : 'some-id'})
            
        ctx.assert.equal(properties.id, 'some-id')
    })

})
