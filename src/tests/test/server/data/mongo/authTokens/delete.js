const mocha = require(_$t+'helpers/testbase')

mocha('mongo/authTokens/delete', async(ctx)=>{

    it('mongo/authTokens/delete::happy    deletes authToken', async () => {
        let actualId,
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
