describe('mongo/songs/delete', async()=>{

    it('mongo/songs/delete::happy::deletes song', async () => {

        let ctx = require(_$t+'testcontext'),
            mongo = require(_$+'data/mongo/songs'),
            actualId 

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            delete (collection, id){
                actualId = id
            }
        })

        await mongo.delete('dafda')
        ctx.assert.equal(actualId, 'dafda')
    })

})
