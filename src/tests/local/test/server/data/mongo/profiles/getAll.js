describe('mongo/profiles/getAll', async()=>{

    it('mongo/profiles/getAll::happy::gets all profiles', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            find (collection, query){
                return [{query, _id : 'some-id'}]
            }
        })
        
        let mongo = require(_$+'data/mongo/profile'),
            records = await mongo.getAll('dafda')

        ctx.assert.equal(records[0].id, 'some-id')
    })

})
