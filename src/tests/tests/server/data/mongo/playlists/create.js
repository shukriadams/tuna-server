const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('mongo/playlists/create', async(testArgs)=>{

    it('happy path : creates playlist', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            create : (collection, record)=>{
                return record
            }
        })

        const mongo = require(_$+'data/mongo/playlist'),
            record = await mongo.create({ id : testArgs.mongoId })

        assert.equal(record.id, testArgs.mongoId)
    })

})
