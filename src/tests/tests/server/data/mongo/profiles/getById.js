const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('mongo/profiles/getById', async(testArgs)=>{

    it('happy path : gets profile by id', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            findById : (collection, query)=>{
                return { query, _id : 'some-id' }
            }
        })
        
        let mongo = require(_$+'data/mongo/profile'),
            record = await mongo.getById('dafda')

        assert.equal(record.id, 'some-id')
    })

})
