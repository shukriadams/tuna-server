const mocha = require(_$t+'helpers/testbase')

mocha('mongo/songs/update', async(ctx)=>{

    it('mongo/songs/update::happy    updates song', async () => {

        // replace call to mongo
        let updatedRecord,
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
