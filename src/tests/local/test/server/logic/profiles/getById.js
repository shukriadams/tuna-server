describe('logic/profiles/getById', async()=>{

    it('logic/profiles/getById::happy::get by id', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'cache/profile', {
            getById (profileId){
                return { profileId }
            }
        })

        const logic = require(_$+'logic/profiles'),
            profile = await logic.getById('my-id')

        ctx.assert.equal(profile.profileId, 'my-id')
    })

})
