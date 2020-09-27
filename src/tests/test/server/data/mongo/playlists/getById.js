const mocha = require(_$t+'helpers/testbase')

mocha('mongo/playlists/getById', async(ctx)=>{

    it('mongo/playlists/getById::happy    gets playlist by id', async () => {

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
