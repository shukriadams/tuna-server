const mocha = require(_$t+'helpers/testbase')

mocha('logic/playlists/delete', async(ctx)=>{

    it('logic/playlists/delete::happy    deletes playlists for a profile', async () => {

        let logic = require(_$+'logic/playlists'),
            actualPlaylistId,
            actualProfileId

        ctx.inject.object(_$+'cache/playlist', {
            delete (playlistId, profileId){
                actualPlaylistId = playlistId
                actualProfileId = profileId
            }
        })

        await logic.delete('some-playlistid', 'some-profile')
        ctx.assert.equal(actualPlaylistId, 'some-playlistid')
        ctx.assert.equal(actualProfileId, 'some-profile')
    })

})
