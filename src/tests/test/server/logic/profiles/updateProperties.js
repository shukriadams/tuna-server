const mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/updateProperties', async(ctx)=>{

    it('logic/profiles/updateProperties::happy updates profile properties', async () => {
        
        ctx.inject.object(_$+'logic/profiles', {
            getById(){
                return { id : null }
            },
            update(properties){
                return properties
            }
        })

        const logic = require(_$+'logic/profiles'),
            properties = await logic.updateProperties({ id : 'some-id'})
            
        ctx.assert.equal(properties.id, 'some-id')
    })

})
