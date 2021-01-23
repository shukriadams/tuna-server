describe('mongo/eventLogs/getActive', async()=>{

    it('mongo/eventLogs/getActive::happy::page eventLogs', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            find (){
                return [{ _id : ctx.mongoId }]
            }
        })

        const mongo = require(_$+'data/mongo/eventLog'),
            page = await mongo.getActive()

        ctx.assert.equal(page[0].id, ctx.mongoId)
    })

})
