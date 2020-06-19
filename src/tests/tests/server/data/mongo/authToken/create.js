const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokenData : create', async(testArgs)=>{

    it('happy path : creates authToken', async () => {
        let authTokenMongo = require(_$+'data/mongo/authToken')

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            create : (collection, record)=>{
                return record
            }
        })

        const actualAuthToken = await authTokenMongo.create({ id : 'some-id' })

        assert.equal(actualAuthToken.id, 'some-id')
    })

})
