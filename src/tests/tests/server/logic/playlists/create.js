const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('logic/playlists/create', async(testArgs)=>{

    it('happy path : creates playlist', async () => {

        // replace call to mongo
        let logic = require(_$+'logic/playlists'),
            actualPlaylist

        inject.object(_$+'cache/playlist', {
            create : (playlist)=>{
                actualPlaylist = playlist
            }
        })

        await logic.create({ name : 'my-playlist'}, 'some-profile')

        assert.equal(actualPlaylist.name, 'my-playlist')
        assert.equal(actualPlaylist.profileId, 'some-profile')
    })

    it('unhappy path : creates playlist, no playlist', async () => {
        let logic = require(_$+'logic/playlists'),
            exception = await assert.throws(async () => await logic.create(null, 'some-profile') )
        
        assert.equal(exception.log, 'playlist required')
    })

    it('unhappy path : creates playlist, no profile', async () => {
        let logic = require(_$+'logic/playlists'),
            exception = await assert.throws(async () => await logic.create({ name : 'my-playlist'}) )
        
        assert.equal(exception.log, 'profileId required')
    })

    it('unhappy path : creates playlist, no playlist name', async () => {
        let logic = require(_$+'logic/playlists'),
            exception = await assert.throws(async () => await logic.create({ notAName : 'my-playlist'}, 'some-profile') )
        
        assert.equal(exception.log, 'name required')
    })

})
