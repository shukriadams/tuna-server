describe('cache/eventLogs/create', async()=>{

    it('cache/eventLogs/create::happy::creates eventLog', async () => {
        const ctx = require(_$t+'testcontext')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/eventLog', {
            create (record){
                return record
            }
        })
        
        const cache = require(_$+'cache/eventLog'),
            createdRecord = await cache.create({ id : 'some-id' })

        ctx.assert.equal(createdRecord.id, 'some-id')
    })

})
