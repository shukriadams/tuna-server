const mocha = require(_$t+'helpers/testbase')

mocha('logic/playlists/getAll', async(ctx)=>{

    it('logic/playlists/getAll::happy    gets playlists for a profile', async () => {

        let logic = require(_$+'logic/playlists'),
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
