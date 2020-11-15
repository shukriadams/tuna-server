describe('cache/songs/deleteAll', async()=>{

    it('cache/songs/deleteAll::happy::deletes all profile songs', async () => {
        let ctx = require(_$t+'testcontext'),
            called = false,
            actualProfileId,
            songsCache = require(_$+'cache/songs')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/songs', {
            deleteForProfile (profileId){
                actualProfileId = profileId
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            remove (){
                called = true
            }
        })

        await songsCache.deleteForProfile('fgsfg')
        ctx.assert.equal(actualProfileId, 'fgsfg')
        ctx.assert.true(called)
    })

})
