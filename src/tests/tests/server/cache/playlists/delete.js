const mocha = require(_$t+'helpers/testbase')

mocha('cache/playlists/delete', async(ctx)=>{

    it('cache/playlists/delete::happy    deletes a playlist', async () => {
        let called = false,
            actualPlaylist,
            playlistCache = require(_$+'cache/playlist')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/playlist', {
            delete (playlist){
                actualPlaylist = playlist
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            remove(key, json){
                called = true
            }
        })

        await playlistCache.delete({id : 'some-delete-id'})

        ctx.assert.equal(actualPlaylist.id, 'some-delete-id')
        ctx.assert.true(called)
    })

})
