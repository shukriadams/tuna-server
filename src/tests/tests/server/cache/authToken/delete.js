const mocha = require(_$t+'helpers/testbase')

mocha('cache/authTokens/delete', async(ctx)=>{

    it('cache/authTokens/delete::happy    deletes an authToken', async () => {

        let authTokenCache = require(_$+'cache/authToken'),
            actualId = null, 
            actualKey = null

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/authToken', {
            delete (id){
                actualId = id
            }
        })
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            remove(key){
                actualKey = key
            }
        })

        await authTokenCache.delete('something')
        ctx.assert.notNull(actualId)
        ctx.assert.notNull(actualKey)
    })

})
