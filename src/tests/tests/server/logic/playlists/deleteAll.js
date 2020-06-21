const mocha = require(_$t+'helpers/testbase')

mocha('logic/playlists/deleteAll', async(ctx)=>{

    it('logic/playlists/deleteAll::happy    deletes playlists for a profile', async () => {

        let logic = require(_$+'logic/playlists'),
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
