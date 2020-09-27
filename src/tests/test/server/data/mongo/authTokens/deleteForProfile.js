describe('mongo/authTokens/deleteForProfile', async()=>{

    it('mongo/authTokens/deleteForProfile::happy::deletes authTokens for profile', async () => {
        let ctx = require(_$t+'testcontext'),
            authTokenMongo = require(_$+'data/mongo/authToken'),
            actualQuery 

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            deleteMany (collection, query){
                actualQuery = query
            }
        })
        
        await authTokenMongo.deleteForProfile('dafda')
        ctx.assert.equal(actualQuery.profileId, 'dafda')
    })

})
