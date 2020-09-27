const mocha = require(_$t+'helpers/testbase')

mocha('mongo/playlists/delete', async(ctx)=>{

    it('mongo/playlists/delete::happy    deletes playlist', async () => {

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            delete (collection, id){
                return id
            }
        })

        const mongo = require(_$+'data/mongo/playlist'),
            id = await mongo.delete('dafda')

        ctx.assert.equal(id, 'dafda')
    })

})
