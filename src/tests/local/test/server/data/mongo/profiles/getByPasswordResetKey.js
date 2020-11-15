describe('mongo/profiles/getByPasswordResetKey', async()=>{

    it('mongo/profiles/getByPasswordResetKey::happy::gets playlist by password reset key', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            findOne (collection, query){
                return { query, _id : 'some-id' }
            }
        })
        
        let mongo = require(_$+'data/mongo/profile'),
            record = await mongo.getByPasswordResetKey('dafda')

        ctx.assert.equal(record.id, 'some-id')
    })

})
