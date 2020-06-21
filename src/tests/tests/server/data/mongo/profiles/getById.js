const mocha = require(_$t+'helpers/testbase')

mocha('mongo/profiles/getById', async(ctx)=>{

    it('mongo/profiles/getById::happy    gets profile by id', async () => {

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            findById (collection, query){
                return { query, _id : 'some-id' }
            }
        })
        
        let mongo = require(_$+'data/mongo/profile'),
            record = await mongo.getById('dafda')

        ctx.assert.equal(record.id, 'some-id')
    })

})
