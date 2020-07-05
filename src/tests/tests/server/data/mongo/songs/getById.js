const mocha = require(_$t+'helpers/testbase')

mocha('mongo/songs/getById', async(ctx)=>{

    it('mongo/songs/getById::happy    gets song by id', async () => {

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            findById (collection, query){
                return { query, _id : 'some-id' }
            }
        })
        
        const mongo = require(_$+'data/mongo/songs'),
            record = await mongo.getById('dafda')

        ctx.assert.equal(record.id, 'some-id')
    })

})
