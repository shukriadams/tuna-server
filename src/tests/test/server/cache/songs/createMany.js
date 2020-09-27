describe('cache/songs/createMany', async()=>{

    it('cache/songs/createMany::happy::creates and caches profile', async () => {
        let ctx = require(_$t+'testcontext'),
            called = false,
            songsCache = require(_$+'cache/songs')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/songs', {
            createMany (songs){
                return songs
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            remove (){
                called = true
            }
        })

        await songsCache.createMany([{ profileId : 'some-songs-create-id' }])
        ctx.assert.true(called)
    })

})
