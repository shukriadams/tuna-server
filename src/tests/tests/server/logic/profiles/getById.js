const mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/getById', async(ctx)=>{

    it('happy path : get by id', async () => {

        ctx.inject.object(_$+'cache/profile', {
            getById : (profileId)=>{
                return { profileId }
            }
        })

        const logic = require(_$+'logic/profiles'),
            profile = await logic.getById('my-id')

        ctx.assert.equal(profile.profileId, 'my-id')
    })

})
