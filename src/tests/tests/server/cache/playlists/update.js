const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('playlistCache : update', async(testArgs)=>{

    it('happy path : updates a playlist', async () => {
        let called = false,
            actualPlaylist,
            playlistCache = require(_$+'cache/playlist')

        // replace call to mongo
        inject.object(_$+'data/mongo/playlist', {
            update : (playlist)=>{
                actualPlaylist = playlist
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            remove : (key, json)=>{
                called = true
            }
        })

        await playlistCache.update({id : 'some-update-id'})

        assert.equal(actualPlaylist.id, 'some-update-id')
        assert.true(called)
    })

})
