describe('mongo/logs/create', async()=>{

    it('mongo/logs/create::happy::creates log entry', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            create (collection, record){
                return record
            }
        })

        const logMongo = require(_$+'data/mongo/log'),
            actualLog = await logMongo.create({ id : ctx.mongoId })

        ctx.assert.equal(actualLog.id, ctx.mongoId)
    })

})
