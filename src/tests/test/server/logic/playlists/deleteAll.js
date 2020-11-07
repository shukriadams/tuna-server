describe('logic/playlists/deleteAll', async()=>{

    it('logic/playlists/deleteAll::happy::deletes playlists for a profile', async () => {

        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/playlists'),
            actualProfileId

        ctx.inject.object(_$+'cache/playlist', {
            deleteAll (profileId){
                actualProfileId = profileId
            }
        })

        await logic.deleteAll('some-profile')
        ctx.assert.equal(actualProfileId, 'some-profile')
    })

})
