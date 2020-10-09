describe('cache/playlog/page', async()=>{

    it('cache/playlog/page::happy::pages playlogs', async () => {
        let ctx = require(_$t+'testcontext')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/playlog', {
            page (record){
                return record
            }
        })

        const cache = require(_$+'cache/playlog')
        const result = await cache.page({id : 'some-id3'})
        ctx.assert.equal(result.id, 'some-id3')
    })

})
