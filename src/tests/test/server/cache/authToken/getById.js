const mocha = require(_$t+'helpers/testbase')

mocha('cache/authTokens/getById', async(ctx)=>{

    it('cache/authTokens/getById::happy    gets authTokens by id, already cached', async () => {
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            get (){
                return JSON.stringify({ foo: 'bar' })
            }
        })

        const authTokenCache = require(_$+'cache/authToken'),
            authToken = await authTokenCache.getById('some-id')

        ctx.assert.equal(authToken.foo, 'bar')
    })



    
    it('cache/authTokens/getById::happy    gets authTokens by id, not cached', async () => {
        let cachedAuthToken

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/authToken', {
            getById (id){
                return { id }
            }
        })

        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            add (key, authToken){
                cachedAuthToken = JSON.parse(authToken)
            },
            // return null to force data call
            get(){
                return null 
            }
        })

        const authTokenCache = require(_$+'cache/authToken'),
            authToken = await authTokenCache.getById('some-id2')

        ctx.assert.equal(authToken.id, 'some-id2')
        ctx.assert.equal(cachedAuthToken.id, 'some-id2')        
    })

})
