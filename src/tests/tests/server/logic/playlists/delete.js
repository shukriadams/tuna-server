const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('logic/playlists/delete', async(testArgs)=>{

    it('happy path : deletes playlists for a profile', async () => {

        let logic = require(_$+'logic/playlists'),
            actualPlaylistId,
            actualProfileId

        inject.object(_$+'cache/playlist', {
            delete : (playlistId, profileId)=>{
                actualPlaylistId = playlistId
                actualProfileId = profileId
            }
        })

        await logic.delete('some-playlistid', 'some-profile')
        assert.equal(actualPlaylistId, 'some-playlistid')
        assert.equal(actualProfileId, 'some-profile')
    })

})
