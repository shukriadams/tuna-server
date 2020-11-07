describe('cache/playlists/create', async()=>{

    it('cache/playlists/create::happy::creates and caches playlist', async () => {
        let ctx = require(_$t+'testcontext'),
            called = false,
            playlistCache = require(_$+'cache/playlist')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/playlist', {
            create (playlist){
                return playlist
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            remove(key, json){
                called = true
            }
        })

        const actualPlaylist = await playlistCache.create({id : 'some-id'})

        ctx.assert.equal(actualPlaylist.id, 'some-id')
        ctx.assert.true(called)
    })

})
