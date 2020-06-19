const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokenData : delete', async(testArgs)=>{

    it('happy path : deletes authToken', async () => {
        let authTokenMongo = require(_$+'data/mongo/authToken')

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            delete : (collection, id)=>{
                return id
            }
        })

        const actualId = await authTokenMongo.create('dafda')

        assert.equal(actualId, 'dafda')
    })

})
