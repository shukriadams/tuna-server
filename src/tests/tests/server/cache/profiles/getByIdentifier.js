const mocha = require(_$t+'helpers/testbase')

mocha('cache/profiles/getByIdentifier', async(ctx)=>{

    it('cache/profiles/getByIdentifier::happy    gets profile by identifier', async () => {
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
