describe('cache/profiles/getByIdentifier', async()=>{

    it('cache/profiles/getByIdentifier::happy::gets profile by identifier', async () => {
        const ctx = require(_$t+'testcontext')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/profile', {
            getByIdentifier (identifier){
                return { identifier }
            }
        })
        
        const profilesCache = require(_$+'cache/profile'),
            profiles = await profilesCache.getByIdentifier('some-identifier')

        ctx.assert.equal(profiles.identifier, 'some-identifier')
    })

})
