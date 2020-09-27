describe('mongo/playlists/getForProfile', async()=>{

    it('mongo/playlists/getForProfile::happy::gets playlists for profile', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            find (collection, query){
                return [{query, _id : 'some-id'}]
            }
        })
        
        let mongo = require(_$+'data/mongo/authToken'),
            records = await mongo.getForProfile('dafda')

        ctx.assert.equal(records[0].id, 'some-id')
    })

})
