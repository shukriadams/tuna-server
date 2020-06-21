const mocha = require(_$t+'helpers/testbase')

mocha('mongo/songs/deleteForProfile', async(ctx)=>{

    it('mongo/songs/deleteForProfile::happy    deletes songs for profile', async () => {

        let mongo = require(_$+'data/mongo/songs'),
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
