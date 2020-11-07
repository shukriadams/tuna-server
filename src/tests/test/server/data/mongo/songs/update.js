describe('mongo/songs/update', async()=>{

    it('mongo/songs/update::happy::updates song', async () => {

        // replace call to mongo
        let ctx = require(_$t+'testcontext'),
            updatedRecord,
            updatedId

        ctx.inject.object(_$+'data/mongo/common', {
            update (collection, id, record){
                updatedId = id
                updatedRecord = record
            }
        })

        const mongo = require(_$+'data/mongo/songs')
        await mongo.update({ id : ctx.mongoId, thing : 'stuff' })

        ctx.assert.equal(updatedId, ctx.mongoId)
        ctx.assert.equal(updatedRecord.thing, 'stuff')
    })

})
