const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('mongo/profiles/create', async(testArgs)=>{

    it('happy path : creates profile', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            create : (collection, record)=>{
                return record
            }
        })

        const mongo = require(_$+'data/mongo/profile'),
            record = await mongo.create({ id : testArgs.mongoId })

        assert.equal(record.id, testArgs.mongoId)
    })

})
