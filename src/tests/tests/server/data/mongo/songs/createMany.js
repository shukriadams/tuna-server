const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('songsData : create', async(testArgs)=>{

    it('happy path : creates songs', async () => {

        // replace call to mongo
        let mongo = require(_$+'data/mongo/songs'),
            actualRecords

        inject.object(_$+'data/mongo/common', {
            createMany : (collection, records)=>{
                actualRecords = records
            }
        })

        await mongo.createMany([{ id : testArgs.mongoId }])

        assert.equal(actualRecords[0]._id, testArgs.mongoId)
    })

})
