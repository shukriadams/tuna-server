const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('playlistsData : getAll', async(testArgs)=>{

    it('happy path : gets all profiles', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            find : (collection, query)=>{
                return [{query, _id : 'some-id'}]
            }
        })
        
        let mongo = require(_$+'data/mongo/profile'),
            records = await mongo.getAll('dafda')

        assert.equal(records[0].id, 'some-id')
    })

})
