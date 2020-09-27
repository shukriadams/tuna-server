describe('mongo/authTokens/getById', async()=>{

    it('mongo/authTokens/getById::happy::gets authToken by id', async () => {
        const ctx = require(_$t+'testcontext')

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
