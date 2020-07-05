const mocha = require(_$t+'helpers/testbase')

mocha('mongo/authTokens/getById', async(ctx)=>{

    it('mongo/authTokens/getById::happy    gets authToken by id', async () => {

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            findById (collection, query){
                return { query, _id : 'some-id' }
            }
        })
        
        let authTokenMongo = require(_$+'data/mongo/authToken'),
            authToken = await authTokenMongo.getById('dafda')

        ctx.assert.equal(authToken.id, 'some-id')
    })

})
