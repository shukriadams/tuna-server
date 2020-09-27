const mocha = require(_$t+'helpers/testbase')

mocha('mongo/authTokens/deleteForProfile', async(ctx)=>{

    it('mongo/authTokens/deleteForProfile::happy    deletes authTokens for profile', async () => {
        let authTokenMongo = require(_$+'data/mongo/authToken'),
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
