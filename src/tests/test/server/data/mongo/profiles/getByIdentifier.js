describe('mongo/profiles/getByIdentifier', async()=>{

    it('mongo/profiles/getByIdentifier::happy::gets playlist by identifier', async () => {
        const ctx = require(_$t+'testcontext')
        
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
