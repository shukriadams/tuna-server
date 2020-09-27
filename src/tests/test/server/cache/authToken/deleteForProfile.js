describe('cache/authTokens/deleteForProfile', async()=>{

    it('cache/authTokens/deleteForProfile::happy::deletes an authToken', async () => {
        let ctx = require(_$t+'testcontext'),
            authTokenCache = require(_$+'cache/authToken'),
            actualId = null

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/authToken', {
            deleteForProfile (id) {
                actualId = id
            }
        })

        await authTokenCache.deleteForProfile('something')

        ctx.assert.notNull(actualId)
    })

})
