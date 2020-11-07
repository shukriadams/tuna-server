describe('mongo/profiles/delete', async()=>{

    it('mongo/profiles/delete::happy::deletes profile', async () => {

        let ctx = require(_$t+'testcontext'),
            mongo = require(_$+'data/mongo/profile'),
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
