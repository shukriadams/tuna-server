const mocha = require(_$t+'helpers/testbase')

mocha('mongo/profiles/getByIdentifier', async(ctx)=>{

    it('mongo/profiles/getByIdentifier::happy    gets playlist by identifier', async () => {

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            findOne (collection, query){
                return { query, _id : 'some-id' }
            }
        })
        
        let mongo = require(_$+'data/mongo/profile'),
            record = await mongo.getByIdentifier('dafda')

        ctx.assert.equal(record.id, 'some-id')
    })

})
