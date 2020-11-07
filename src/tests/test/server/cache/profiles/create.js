describe('cache/profiles/create', async()=>{

    it('cache/profiles/create::happy::creates and caches profile', async () => {
        let ctx = require(_$t+'testcontext'),
            actualProfile,
            profilesCache = require(_$+'cache/profile')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/profile', {
            create (profile){
                return profile
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            add (key, json){
                actualProfile = JSON.parse(json)
            }
        })

        await profilesCache.create({id : 'some-profile-create-id'})
        ctx.assert.equal(actualProfile.id, 'some-profile-create-id')
    })

})
