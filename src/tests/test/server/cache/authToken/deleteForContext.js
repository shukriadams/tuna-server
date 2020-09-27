describe('cache/authTokens/deleteForContext', async()=>{
    it('cache/authTokens/deleteForContext::happy::deletes an authToken', async () => {
        let ctx = require(_$t+'testcontext'),
            authTokenCache = require(_$+'cache/authToken'),
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
