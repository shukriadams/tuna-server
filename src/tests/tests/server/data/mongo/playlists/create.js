const mocha = require(_$t+'helpers/testbase')

mocha('mongo/playlists/create', async(ctx)=>{

    it('mongo/playlists/create::happy    creates playlist', async () => {

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            create : (collection, record)=>{
                return record
            }
        })

        const mongo = require(_$+'data/mongo/playlist'),
            record = await mongo.create({ id : ctx.mongoId })

        ctx.assert.equal(record.id, ctx.mongoId)
    })

})
