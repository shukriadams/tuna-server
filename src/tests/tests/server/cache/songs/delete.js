const mocha = require(_$t+'helpers/testbase')

mocha('cache/songs/delete', async(ctx)=>{

    it('cache/songs/delete::happy    deletes a songs', async () => {
        let called = false,
            actualSongId,
            songsCache = require(_$+'cache/songs')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/songs', {
            delete (songId){
                actualSongId = songId
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            remove (){
                called = true
            }
        })

        await songsCache.delete({ id : 'some-delete-id'})

        ctx.assert.equal(actualSongId, 'some-delete-id')
        ctx.assert.true(called)
    })

})
