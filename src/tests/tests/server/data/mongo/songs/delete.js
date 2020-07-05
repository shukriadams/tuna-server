const mocha = require(_$t+'helpers/testbase')

mocha('mongo/songs/delete', async(ctx)=>{

    it('mongo/songs/delete::happy    deletes song', async () => {

        let mongo = require(_$+'data/mongo/songs'),
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
