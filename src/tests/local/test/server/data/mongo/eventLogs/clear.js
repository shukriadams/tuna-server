describe('mongo/eventLogs/clear', async()=>{

    it('mongo/eventLogs/clear::happy::clears eventLogs', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            deleteMany (){
                return 532
            }
        })

        const mongo = require(_$+'data/mongo/eventLog'),
            result = await mongo.clear()

        ctx.assert.equal(result, 532)
    })

})
