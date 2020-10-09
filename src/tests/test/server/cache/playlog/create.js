describe('cache/playlog/create', async()=>{

    it('cache/playlog/create::happy::creates playlog', async () => {
        let ctx = require(_$t+'testcontext')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/playlog', {
            create (record){
                return record
            }
        })

        const cache = require(_$+'cache/playlog')
        const result = await cache.create({id : 'some-id2'})
        ctx.assert.equal(result.id, 'some-id2')
    })

})
