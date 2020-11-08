describe('logic/playlists/delete', async()=>{

    it('logic/playlists/delete::happy::deletes playlists for a profile', async () => {

        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/playlists'),
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
