describe('cache/profiles/getById', async()=>{

    it('cache/profiles/getById::happy::gets profile by id, already cached', async () => {
        const ctx = require(_$t+'testcontext')
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            get (){
                return JSON.stringify({ foo: 'bardfd' })
            }
        })

        const profilesCache = require(_$+'cache/profile'),
            profile = await profilesCache.getById('some-id')

        ctx.assert.equal(profile.foo, 'bardfd')
    })




    it('cache/profiles/getById::happy::gets profile by id, not cached', async () => {
        let ctx = require(_$t+'testcontext'),
            cachedProfile

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/profile', {
            getById (id){
                return { id }
            }
        })

        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            add (key, profile){
                cachedProfile = JSON.parse(profile)
            },
            // return null to force data call
            get (){
                return null 
            }
        })

        const profilesCache = require(_$+'cache/profile'),
            profile = await profilesCache.getById('some-id22')

        ctx.assert.equal(profile.id, 'some-id22')
        ctx.assert.equal(cachedProfile.id, 'some-id22')        
    })

})
