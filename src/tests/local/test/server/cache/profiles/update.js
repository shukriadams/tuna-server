describe('cache/profiles/update', async()=>{

    it('cache/profiles/update::happy::updates a profile', async () => {
        let ctx = require(_$t+'testcontext'),
            added = false,
            actualProfile,
            profilesCache = require(_$+'cache/profile')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/profile', {
            update (profile){
                actualProfile = profile
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'lib/cache', {
            add (){
                added = true
            }
        })

        await profilesCache.update({ id : 'some-update-id' })

        ctx.assert.equal(actualProfile.id, 'some-update-id')
        ctx.assert.true(added)
    })

})
