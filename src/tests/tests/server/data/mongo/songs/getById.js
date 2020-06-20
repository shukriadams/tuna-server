const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('songsData : getById', async(testArgs)=>{

    it('happy path : gets song by id', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            findById : (collection, query)=>{
                return { query, _id : 'some-id' }
            }
        })
        
        let mongo = require(_$+'data/mongo/songs'),
            record = await mongo.getById('dafda')

        assert.equal(record.id, 'some-id')
    })

})
