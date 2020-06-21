const mocha = require(_$t+'helpers/testbase')

mocha('mongo/profiles/create', async(ctx)=>{

    it('mongo/profiles/create::happy    creates profile', async () => {

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            create (collection, record){
                return record
            }
        })

        const mongo = require(_$+'data/mongo/profile'),
            record = await mongo.create({ id : ctx.mongoId })

        ctx.assert.equal(record.id, ctx.mongoId)
    })

})
