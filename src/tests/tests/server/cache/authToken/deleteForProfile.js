const mocha = require(_$t+'helpers/testbase')

mocha('cache/authTokens/deleteForProfile', async(ctx)=>{

    it('cache/authTokens/deleteForProfile::happy    deletes an authToken', async () => {
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/authToken', {
            deleteForProfile (id) {
                actualId = id
            }
        })

        let authTokenCache = require(_$+'cache/authToken'),
            actualId = null

        await authTokenCache.deleteForProfile('something')

        ctx.assert.notNull(actualId)
    })

})
