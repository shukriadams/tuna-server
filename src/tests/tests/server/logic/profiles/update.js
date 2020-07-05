const mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/update', async(ctx)=>{

    it('logic/profiles/update::happy    updates profile', async () => {
        
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
