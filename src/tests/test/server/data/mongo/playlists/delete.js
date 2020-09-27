describe('mongo/playlists/delete', async()=>{

    it('mongo/playlists/delete::happy::deletes playlist', async () => {
        const ctx = require(_$t+'testcontext')
        
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
