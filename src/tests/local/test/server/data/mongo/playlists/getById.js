describe('mongo/playlists/getById', async()=>{

    it('mongo/playlists/getById::happy::gets playlist by id', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            findById (collection, query){
                return { query, _id : 'some-id' }
            }
        })
        
        let mongo = require(_$+'data/mongo/playlist'),
            record = await mongo.getById('dafda')

        ctx.assert.equal(record.id, 'some-id')
    })

})
