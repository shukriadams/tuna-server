describe('logic/profiles/getAll', async()=>{

    it('logic/profiles/getAll::happy::gets all profiles', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'cache/profile', {
            getAll (){
                return [{id : 'some-id'}]
            }
        })

        const logic = require(_$+'logic/profiles'),
            profiles = await logic.getAll()

        ctx.assert.true(profiles.length, 1)
        ctx.assert.equal(profiles[0].id, 'some-id')
    })

})
