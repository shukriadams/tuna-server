describe('logic/profiles/updateProperties', async()=>{

    it('logic/profiles/updateProperties::happy updates profile properties', async () => {
        const ctx = require(_$t+'testcontext')
        
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
