const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('playlistsLogic : gets all playlists for profile', async(testArgs)=>{

    it('happy path : gets playlists for a profile', async () => {

        let logic = require(_$+'logic/playlists'),
            actualProfileId

        inject.object(_$+'cache/playlist', {
            getAll : (profileId)=>{
                actualProfileId = profileId
            }
        })

        await logic.getAll('some-profile')
        assert.equal(actualProfileId, 'some-profile')
    })

})
