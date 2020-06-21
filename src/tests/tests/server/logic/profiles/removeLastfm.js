const mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/removeLastfm', async(ctx)=>{

    it('logic/profiles/removeLastfm::happy    removes lastfm', async () => {
        let actualProfile

        ctx.inject.object(_$+'cache/profile', {
            getById (profileId){
                return { profileId }
            },
            update (profile){
                actualProfile = profile
            }
        })

        const logic = require(_$+'logic/profiles')
        await logic.removeLastfm('my-id')
        ctx.assert.equal(actualProfile.profileId, 'my-id')
    })

})
