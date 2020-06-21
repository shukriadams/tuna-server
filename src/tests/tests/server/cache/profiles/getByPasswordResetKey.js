const mocha = require(_$t+'helpers/testbase')

mocha('cache/profiles/getByPasswordResetKey', async(ctx)=>{

    it('cache/profiles/getByPasswordResetKey::happy    gets profile by identifier', async () => {
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/profile', {
            getByPasswordResetKey (resetKey){
                return { resetKey }
            }
        })

        const profilesCache = require(_$+'cache/profile'),
            profiles = await profilesCache.getByPasswordResetKey('some-key')

        ctx.assert.equal(profiles.resetKey, 'some-key')
    })

})
