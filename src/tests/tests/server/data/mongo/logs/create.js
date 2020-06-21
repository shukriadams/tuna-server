const mocha = require(_$t+'helpers/testbase')

mocha('mongo/logs/create', async(ctx)=>{

    it('mongo/logs/create::happy    creates log entry', async () => {

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            create : (collection, record)=>{
                return record
            }
        })

        const logMongo = require(_$+'data/mongo/log'),
            actualLog = await logMongo.create({ id : ctx.mongoId })

        ctx.assert.equal(actualLog.id, ctx.mongoId)
    })

})
