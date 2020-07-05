const mocha = require(_$t+'helpers/testbase')

mocha('mongo/songs/create', async(ctx)=>{

    it('mongo/songs/create::happy    creates songs', async () => {

        // replace call to mongo
        let mongo = require(_$+'data/mongo/songs'),
            actualRecords

        ctx.inject.object(_$+'data/mongo/common', {
            createMany (collection, records){
                actualRecords = records
            }
        })

        await mongo.createMany([{ id : ctx.mongoId }])

        ctx.assert.equal(actualRecords[0]._id, ctx.mongoId)
    })

})
