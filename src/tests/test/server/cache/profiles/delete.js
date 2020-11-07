describe('cache/profiles/delete', async()=>{

    it('cache/profiles/delete::happy::deletes a profile', async () => {
        let ctx = require(_$t+'testcontext'),
            called = false,
            actualProfile,
            profilesCache = require(_$+'cache/profile')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/profile', {
            delete (profile){
                actualProfile = profile
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            remove (key, json){
                called = true
            }
        })

        await profilesCache.delete({ id : 'some-delete-id' })
        ctx.assert.equal(actualProfile.id, 'some-delete-id')
        ctx.assert.true(called)
    })

})
