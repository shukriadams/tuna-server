const mocha = require(_$t+'helpers/testbase')

mocha('cache/authTokens/create', async(ctx)=>{

    it('cache/authTokens/create::happy    creates and caches authToken', async () => {
        let actualAuthToken,
            authTokenCache = require(_$+'cache/authToken')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/authToken', {
            create (authToken){
                return authToken
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            add (key, json){
                actualAuthToken = JSON.parse(json)
            }
        })

        await authTokenCache.create({id : 'some-id'})
        ctx.assert.equal(actualAuthToken.id, 'some-id')
    })

})
