const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('cache/playlists/delete', async(testArgs)=>{

    it('happy path : deletes a playlist', async () => {
        let called = false,
            actualPlaylist,
            playlistCache = require(_$+'cache/playlist')

        // replace call to mongo
        inject.object(_$+'data/mongo/playlist', {
            delete : (playlist)=>{
                actualPlaylist = playlist
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            remove : (key, json)=>{
                called = true
            }
        })

        await playlistCache.delete({id : 'some-delete-id'})

        assert.equal(actualPlaylist.id, 'some-delete-id')
        assert.true(called)
    })

})
