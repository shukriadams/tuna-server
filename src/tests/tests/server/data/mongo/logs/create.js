const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('logData : create', async(testArgs)=>{

    it('happy path : creates log entry', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            create : (collection, record)=>{
                return record
            }
        })

        const logMongo = require(_$+'data/mongo/log'),
            actualLog = await logMongo.create({ id : testArgs.mongoId })

        assert.equal(actualLog.id, testArgs.mongoId)
    })

})
