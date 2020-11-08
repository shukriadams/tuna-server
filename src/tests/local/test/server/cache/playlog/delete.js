describe('cache/playlog/delete', async()=>{

    it('cache/playlog/delete::happy::deletes a playlog', async () => {
        let ctx = require(_$t+'testcontext')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/playlog', {
            delete (record){
                return record
            }
        })

        const cache = require(_$+'cache/playlog')
        const result = await cache.delete({id : 'some-id5'})
        ctx.assert.equal(result.id, 'some-id5')
    })

})
