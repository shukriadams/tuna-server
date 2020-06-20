const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('playlistsData : getByIdentifier', async(testArgs)=>{

    it('happy path : gets playlist by identifier', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            findOne : (collection, query)=>{
                return { query, _id : 'some-id' }
            }
        })
        
        let mongo = require(_$+'data/mongo/profile'),
            record = await mongo.getByIdentifier('dafda')

        assert.equal(record.id, 'some-id')
    })

})
