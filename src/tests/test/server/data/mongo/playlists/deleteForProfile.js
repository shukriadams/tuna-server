describe('mongo/playlists/deleteForProfile', async()=>{

    it('mongo/playlists/deleteForProfile::happy::deletes playlists for profile', async () => {
        let ctx = require(_$t+'testcontext'),
            mongo = require(_$+'data/mongo/playlist'),
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
