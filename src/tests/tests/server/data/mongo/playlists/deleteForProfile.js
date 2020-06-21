const mocha = require(_$t+'helpers/testbase')

mocha('mongo/playlists/deleteForProfile', async(ctx)=>{

    it('mongo/playlists/deleteForProfile::happy    deletes playlists for profile', async () => {
        let mongo = require(_$+'data/mongo/playlist'),
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
