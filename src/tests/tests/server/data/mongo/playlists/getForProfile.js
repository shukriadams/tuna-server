const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('mongo/playlists/getForProfile', async(testArgs)=>{

    it('happy path : gets playlists for profile', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            find : (collection, query)=>{
                return [{query, _id : 'some-id'}]
            }
        })
        
        let mongo = require(_$+'data/mongo/authToken'),
            records = await mongo.getForProfile('dafda')

        assert.equal(records[0].id, 'some-id')
    })

})
