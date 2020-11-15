describe('mongo/songs/deleteForProfile', async()=>{

    it('mongo/songs/deleteForProfile::happy::deletes songs for profile', async () => {

        let ctx = require(_$t+'testcontext'),
            mongo = require(_$+'data/mongo/songs'),
            actualQuery

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            deleteMany (collection, query){
                actualQuery = query
            }
        })

        await mongo.deleteForProfile('dafda')
        ctx.assert.equal(actualQuery.profileId, 'dafda')
    })

})
