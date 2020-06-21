const mocha = require(_$t+'helpers/testbase')

mocha('mongo/playlists/update', async(ctx)=>{

    it('mongo/playlists/update::happy    updates playlist', async () => {

        // replace call to mongo
        let updatedRecord,
            updatedId

        ctx.inject.object(_$+'data/mongo/common', {
            update (collection, id, record){
                updatedId = id
                updatedRecord = record
            }
        })

        const mongo = require(_$+'data/mongo/playlist')
        await mongo.update({ id : ctx.mongoId, thing : 'stuff' })

        ctx.assert.equal(updatedId, ctx.mongoId)
        ctx.assert.equal(updatedRecord.thing, 'stuff')
    })

})
