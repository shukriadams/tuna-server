describe('mongo/songs/getById', async()=>{

    it('mongo/songs/getById::happy::gets song by id', async () => {
        const ctx = require(_$t+'testcontext')
        
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
