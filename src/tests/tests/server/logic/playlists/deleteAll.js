const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('playlistsLogic : deletes all playlists for profile', async(testArgs)=>{

    it('happy path : deletes playlists for a profile', async () => {

        let logic = require(_$+'logic/playlists'),
            actualProfileId

        inject.object(_$+'cache/playlist', {
            deleteAll : (profileId)=>{
                actualProfileId = profileId
            }
        })

        await logic.deleteAll('some-profile')
        assert.equal(actualProfileId, 'some-profile')
    })

})