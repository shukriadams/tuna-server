describe('mongo/playlists/update', async()=>{

    it('mongo/playlists/update::happy::updates playlist', async () => {
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

        const mongo = require(_$+'data/mongo/playlist')
        await mongo.update({ id : ctx.mongoId, thing : 'stuff' })

        ctx.assert.equal(updatedId, ctx.mongoId)
        ctx.assert.equal(updatedRecord.thing, 'stuff')
    })

})
