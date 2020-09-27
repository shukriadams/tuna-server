const mocha = require(_$t+'helpers/testbase')

mocha('mongo/authTokens/deleteForContext', async(ctx)=>{

    it('mongo/authTokens/deleteForContext::happy    deletes authTokens for a context', async () => {
        let authTokenMongo = require(_$+'data/mongo/authToken'),
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
