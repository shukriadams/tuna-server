describe('cache/playlog/deleteAll', async()=>{

    it('cache/playlog/deleteAll::happy::deletes all playlogs', async () => {
        let ctx = require(_$t+'testcontext')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/playlog', {
            deleteAll (record){
                return record
            }
        })

        const cache = require(_$+'cache/playlog')
        const result = await cache.deleteAll({id : 'some-id4'})
        ctx.assert.equal(result.id, 'some-id4')
    })

})
