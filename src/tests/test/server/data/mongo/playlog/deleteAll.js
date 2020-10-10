describe('mongo/playlog/deleteAll', async()=>{

    it('mongo/playlog/deleteAll::happy::deletes all playlogs', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            deleteMany (){
                return 321
            }
        })

        const mongo = require(_$+'data/mongo/playlog'),
            result = await mongo.deleteAll()

        ctx.assert.equal(result, 321)
    })

})
