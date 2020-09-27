const mocha = require(_$t+'helpers/testbase')

mocha('cache/authTokens/getForProfile', async(ctx)=>{

    it('cache/authTokens/getForProfile::happy    gets authTokens by profile', async () => {
        const authTokenCache = require(_$+'cache/authToken')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/authToken', {
            getForProfile (profile){
                return { profile }
            }
        })
        
        const authToken = await authTokenCache.getForProfile('profile1234')

        ctx.assert.equal(authToken.profile, 'profile1234')
    })

})
