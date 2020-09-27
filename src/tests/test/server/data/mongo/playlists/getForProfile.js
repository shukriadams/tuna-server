const mocha = require(_$t+'helpers/testbase')

mocha('mongo/playlists/getForProfile', async(ctx)=>{

    it('mongo/playlists/getForProfile::happy    gets playlists for profile', async () => {

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
