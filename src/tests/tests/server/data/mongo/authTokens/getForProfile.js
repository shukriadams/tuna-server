const mocha = require(_$t+'helpers/testbase')

mocha('mongo/authTokens/getForProfile', async(ctx)=>{

    it('mongo/authTokens/getForProfile::happy    gets authTokens for profile', async () => {

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
