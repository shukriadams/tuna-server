describe('mongo/playlists/create', async()=>{

    it('mongo/playlists/create::happy::creates playlist', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            create : (collection, record)=>{
                return record
            }
        })

        const mongo = require(_$+'data/mongo/playlist'),
            record = await mongo.create({ id : ctx.mongoId })

        ctx.assert.equal(record.id, ctx.mongoId)
    })

})
