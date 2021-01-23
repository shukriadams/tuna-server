describe('logic/eventLog/clear', async()=>{

    it('logic/eventLog/clear::happy::clears eventLog for a profile', async () => {

        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/eventLog'),
            actualPlaylistId,
            actualProfileId

        ctx.inject.object(_$+'cache/eventLog', {
            clear (playlistId, profileId){
                actualPlaylistId = playlistId
                actualProfileId = profileId
            }
        })

        await logic.clear('some-playlistid', 'some-type')
        ctx.assert.equal(actualPlaylistId, 'some-playlistid')
        ctx.assert.equal(actualProfileId, 'some-type')
    })

})
