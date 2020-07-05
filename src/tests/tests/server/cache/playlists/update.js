const mocha = require(_$t+'helpers/testbase')

mocha('cache/playlists/update', async(ctx)=>{

    it('cache/playlists/update::happy    updates a playlist', async () => {
        let called = false,
            actualPlaylist,
            playlistCache = require(_$+'cache/playlist')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/playlist', {
            update (playlist){
                actualPlaylist = playlist
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            remove (key, json){
                called = true
            }
        })

        await playlistCache.update({id : 'some-update-id'})

        ctx.assert.equal(actualPlaylist.id, 'some-update-id')
        ctx.assert.true(called)
    })

})
