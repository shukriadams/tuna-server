describe('mongo/playlog/create', async()=>{

    it('mongo/playlog/create::happy::creates playlog', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            create (collection, record){
                return record
            }
        })

        const mongo = require(_$+'data/mongo/playlog'),
            record = await mongo.create({ id : ctx.mongoId })

        ctx.assert.equal(record.id, ctx.mongoId)
    })

})
