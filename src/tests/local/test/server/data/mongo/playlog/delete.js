describe('mongo/playlog/delete', async()=>{

    it('mongo/playlog/delete::happy::deletes a playlog', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            delete (){
                return 3211
            }
        })

        const mongo = require(_$+'data/mongo/playlog'),
            result = await mongo.delete(ctx.mongoId)

        ctx.assert.equal(result, 3211)
    })

})
