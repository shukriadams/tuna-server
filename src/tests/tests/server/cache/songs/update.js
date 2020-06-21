const mocha = require(_$t+'helpers/testbase')

mocha('cache/songs/update', async(ctx)=>{

    it('happy path : updates a profile', async () => {
        let called = false,
            songsCache = require(_$+'cache/songs')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/songs', {
            update (profile){
                return profile
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            remove (key, json){
                called = true
            }
        })

        const actualSong = await songsCache.update({ id : 'some-update-id' })
        ctx.assert.equal(actualSong.id, 'some-update-id')
        ctx.assert.true(called)
    })

})
