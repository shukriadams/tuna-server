const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('playlistCache : getAll', async(testArgs)=>{

    it('happy path : gets all playlists, already cached', async () => {
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            get : ()=>{
                return JSON.stringify({ foo: 'bar' })
            }
        })

        const playlistCache = require(_$+'cache/playlist'),
            playlist = await playlistCache.getAll('some-id')

        assert.equal(playlist.foo, 'bar')
    })

    it('happy path : gets all playlists, not cached', async () => {
        let cachedPlaylist

        // replace call to mongo
        inject.object(_$+'data/mongo/playlist', {
            getForProfile : (id)=>{
                return { id }
            }
        })

        // capture call to cache
        inject.object(_$+'helpers/cache', {
            add : (key, authToken)=>{
                cachedPlaylist = JSON.parse(authToken)
            },
            // return null to force data call
            get : ()=>{
                return null 
            }
        })

        const playlistCache = require(_$+'cache/playlist'),
            playlist = await playlistCache.getAll('some-id2')

        assert.equal(playlist.id, 'some-id2')
        assert.equal(cachedPlaylist.id, 'some-id2')        
    })

})
