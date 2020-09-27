describe('mongo/authTokens/getForProfile', async()=>{

    it('mongo/authTokens/getForProfile::happy::gets authTokens for profile', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            find (collection, query){
                return [{query, _id : 'some-id'}]
            }
        })
        
        const authTokenMongo = require(_$+'data/mongo/authToken'),
            authTokens = await authTokenMongo.getForProfile('dafda')

        ctx.assert.equal(authTokens[0].id, 'some-id')
    })

})
