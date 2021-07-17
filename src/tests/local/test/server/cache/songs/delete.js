describe('cache/songs/delete', async()=>{

    it('cache/songs/delete::happy::deletes a songs', async () => {
        let ctx = require(_$t+'testcontext'),
            called = false,
            actualSongId,
            songsCache = require(_$+'cache/songs')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/songs', {
            delete (songId){
                actualSongId = songId
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'lib/cache', {
            remove (){
                called = true
            }
        })

        await songsCache.delete({ id : 'some-delete-id'})

        ctx.assert.equal(actualSongId, 'some-delete-id')
        ctx.assert.true(called)
    })

})
