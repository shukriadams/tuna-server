describe('mongo/playlog/page', async()=>{

    it('mongo/playlog/page::happy::page playlogs', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            find (){
                return [{ _id : ctx.mongoId }]
            }
        })

        const mongo = require(_$+'data/mongo/playlog'),
            page = await mongo.page(0, 10)

        ctx.assert.equal(page[0].id, ctx.mongoId)
    })

})
