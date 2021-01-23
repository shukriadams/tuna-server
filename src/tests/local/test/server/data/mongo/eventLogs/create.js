describe('mongo/eventLogs/create', async()=>{

    it('mongo/eventLogs/create::happy::creates eventLog entry', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            create (collection, record){
                return record
            }
        })

        const logMongo = require(_$+'data/mongo/eventLog'),
            record = await logMongo.create({ id : ctx.mongoId })

        ctx.assert.equal(record.id, ctx.mongoId)
    })

})
