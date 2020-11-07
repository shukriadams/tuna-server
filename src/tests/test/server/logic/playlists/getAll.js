describe('logic/playlists/getAll', async()=>{

    it('logic/playlists/getAll::happy::gets playlists for a profile', async () => {

        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/playlists'),
            actualProfileId

        ctx.inject.object(_$+'cache/playlist', {
            getAll (profileId){
                actualProfileId = profileId
            }
        })

        await logic.getAll('some-profile')
        ctx.assert.equal(actualProfileId, 'some-profile')
    })

})
