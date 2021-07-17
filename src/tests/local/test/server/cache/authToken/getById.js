describe('cache/authTokens/getById', async(ctx)=>{

    it('cache/authTokens/getById::happy::gets authTokens by id, already cached', async () => {
        const ctx = require(_$t+'testcontext')
        
        // capture call to cache
        ctx.inject.object(_$+'lib/cache', {
            get (){
                return JSON.stringify({ foo: 'bar' })
            }
        })

        const authTokenCache = require(_$+'cache/authToken'),
        authToken = await authTokenCache.getById('some-id')

        ctx.assert.equal(authToken.foo, 'bar')
    })


    
    it('cache/authTokens/getById::happy::gets authTokens by id, not cached', async () => {
        let ctx = require(_$t+'testcontext'),
            cachedAuthToken

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/authToken', {
            getById (id){
                return { id }
            }
        })

        // capture call to cache
        ctx.inject.object(_$+'lib/cache', {
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
