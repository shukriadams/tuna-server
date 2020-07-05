const mocha = require(_$t+'helpers/testbase')

mocha('cache/playlists/deleteAll', async(ctx)=>{

    it('cache/playlists/deleteAll::happy    deletes all profile playlists', async () => {
        let called = false,
            actualProfileId,
            playlistCache = require(_$+'cache/playlist')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/playlist', {
            deleteForProfile(profileId){
                actualProfileId = profileId
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            remove(key, json){
                called = true
            }
        })

        await playlistCache.deleteAll('dfefg')

        ctx.assert.equal(actualProfileId, 'dfefg')
        ctx.assert.true(called)
    })

})
