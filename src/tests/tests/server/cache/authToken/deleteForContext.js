const mocha = require(_$t+'helpers/testbase')

mocha('cache/authTokens/deleteForContext', async(ctx)=>{

    it('cache/authTokens/deleteForContex::happy    deletes an authToken', async () => {
        let authTokenCache = require(_$+'cache/authToken'),
            actualprofile = null

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/authToken', {
            deleteForContext (profile){
                actualprofile = profile
            }
        })

        await authTokenCache.deleteForContext('something')

        ctx.assert.notNull(actualprofile)
    })

})
