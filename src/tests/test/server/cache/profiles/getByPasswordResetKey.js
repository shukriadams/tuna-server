describe('cache/profiles/getByPasswordResetKey', async()=>{

    it('cache/profiles/getByPasswordResetKey::happy::gets profile by identifier', async () => {
        const ctx = require(_$t+'testcontext')

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
