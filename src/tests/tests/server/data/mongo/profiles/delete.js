const mocha = require(_$t+'helpers/testbase')

mocha('mongo/profiles/delete', async(ctx)=>{

    it('mongo/profiles/delete::happy    deletes profile', async () => {

        let mongo = require(_$+'data/mongo/profile'),
            actualId 

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            delete (collection, id){
                actualId = id
            }
        })

        await mongo.delete({ id : 'dafda'})
        ctx.assert.equal(actualId, 'dafda')
    })

})
