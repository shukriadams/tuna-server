describe('cache/eventLogs/getActive', async()=>{

    it('cache/eventLogs/getActive::happy::pages playlogs', async () => {
        const ctx = require(_$t+'testcontext')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/eventLog', {
            getActive (record){
                return record
            }
        })

        const cache = require(_$+'cache/eventLog'),
            result = await cache.getActive({ id : 'some-id3' })

        ctx.assert.equal(result.id, 'some-id3')
    })

})
