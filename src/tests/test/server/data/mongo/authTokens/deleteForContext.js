describe('mongo/authTokens/deleteForContext', async()=>{

    it('mongo/authTokens/deleteForContext::happy::deletes authTokens for a context', async () => {
        let ctx = require(_$t+'testcontext'),
            authTokenMongo = require(_$+'data/mongo/authToken'),
            actualQuery

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            deleteMany (collection, query){
                actualQuery = query
            }
        })
        
        await authTokenMongo.deleteForContext('someprofile', 'dafda')
        ctx.assert.equal(actualQuery.$and[1].context.$eq, 'dafda')
    })

})
