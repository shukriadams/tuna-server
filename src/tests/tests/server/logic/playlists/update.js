const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('playlistsLogic : update', async(testArgs)=>{

    it('happy path : updates playlist', async () => {

        // replace call to mongo
        let logic = require(_$+'logic/playlists'),
            actualPlaylist

        inject.object(_$+'cache/playlist', {
            update : (playlist)=>{
                actualPlaylist = playlist
            }
        })

        await logic.update({ name : 'my-playlist', profileId : 'some-profile' })

        assert.equal(actualPlaylist.name, 'my-playlist')
        assert.equal(actualPlaylist.profileId, 'some-profile')
    })

    it('unhappy path : updates playlist, no playlist', async () => {
        let logic = require(_$+'logic/playlists'),
            exception = await assert.throws(async () => await logic.update(null) )
        
        assert.equal(exception.log, 'playlist required')
    })

    it('unhappy path : updates playlist, no profile', async () => {
        let logic = require(_$+'logic/playlists'),
            exception = await assert.throws(async () => await logic.update({ name : 'my-playlist', notAProfile: 'some-profile' }) )
        
        assert.equal(exception.log, 'profileId required')
    })

    it('unhappy path : updates playlist, no playlist name', async () => {
        let logic = require(_$+'logic/playlists'),
            exception = await assert.throws(async () => await logic.update( { notAName : 'my-playlist', profileId: 'some-profile' }) )
        
        assert.equal(exception.log, 'name required')
    })

})
