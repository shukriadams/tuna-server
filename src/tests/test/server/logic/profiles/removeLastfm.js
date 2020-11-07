describe('logic/profiles/removeLastfm', async()=>{

    it('logic/profiles/removeLastfm::happy::removes lastfm', async () => {
        let ctx = require(_$t+'testcontext'),
            actualProfile

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
