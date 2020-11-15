describe('mongo/authTokens/delete', async()=>{

    it('mongo/authTokens/delete::happy::deletes authToken', async () => {
        let actualId,
            ctx = require(_$t+'testcontext'),
            authTokenMongo = require(_$+'data/mongo/authToken')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            delete (collection, id){
                actualId = id
            }
        })

        await authTokenMongo.delete('dafda')
        ctx.assert.equal(actualId, 'dafda')
    })

})
