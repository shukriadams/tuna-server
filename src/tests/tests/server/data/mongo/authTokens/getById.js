const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('mongo/authTokens/getById', async(testArgs)=>{

    it('happy path : gets authToken by id', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            findById : (collection, query)=>{
                return { query, _id : 'some-id' }
            }
        })
        
        let authTokenMongo = require(_$+'data/mongo/authToken'),
            authToken = await authTokenMongo.getById('dafda')

        assert.equal(authToken.id, 'some-id')
    })

})
