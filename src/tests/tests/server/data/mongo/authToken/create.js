const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokenData : create', async(testArgs)=>{

    it('happy path : creates authToken', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            create : (collection, record)=>{
                return record
            }
        })

        const authTokenMongo = require(_$+'data/mongo/authToken'),
            actualAuthToken = await authTokenMongo.create({ id : '5349b4ddd2781d08c09890f4' })

        assert.equal(actualAuthToken.id, '5349b4ddd2781d08c09890f4')
    })

})
