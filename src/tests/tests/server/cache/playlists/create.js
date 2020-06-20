const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('cache/playlists/create', async(testArgs)=>{

    it('happy path : creates and caches playlist', async () => {
        let called = false,
            playlistCache = require(_$+'cache/playlist')

        // replace call to mongo
        inject.object(_$+'data/mongo/playlist', {
            create : (playlist)=>{
                return playlist
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            remove : (key, json)=>{
                called = true
            }
        })

        const actualPlaylist = await playlistCache.create({id : 'some-id'})

        assert.equal(actualPlaylist.id, 'some-id')
        assert.true(called)
    })

})
