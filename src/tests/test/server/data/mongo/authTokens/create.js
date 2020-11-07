describe('mongo/authTokens/create', async()=>{

    it('mongo/authTokens/create::happy::creates authToken', async () => {
        const ctx = require(_$t+'testcontext')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            create (collection, record){
                return record
            }
        })

        const authTokenMongo = require(_$+'data/mongo/authToken'),
            actualAuthToken = await authTokenMongo.create({ id : ctx.mongoId })

        ctx.assert.equal(actualAuthToken.id, ctx.mongoId)
    })

})
