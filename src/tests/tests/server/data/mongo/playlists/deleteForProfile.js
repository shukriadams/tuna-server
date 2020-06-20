const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('mongo/playlists/deleteForProfile', async(testArgs)=>{

    it('happy path : deletes playlists for profile', async () => {
        let mongo = require(_$+'data/mongo/playlist'),
            actualQuery

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            deleteMany : (collection, query)=>{
                actualQuery = query
            }
        })
        
        await mongo.deleteForProfile('dafda')

        assert.equal(actualQuery.profileId, 'dafda')
    })

})
