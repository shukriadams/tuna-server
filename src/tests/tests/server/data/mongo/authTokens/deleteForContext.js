const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokenData : deleteForContext', async(testArgs)=>{

    it('happy path : deletes authTokens for a context', async () => {
        let authTokenMongo = require(_$+'data/mongo/authToken'),
            actualQuery

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            deleteMany : (collection, query)=>{
                actualQuery = query
            }
        })
        
        await authTokenMongo.deleteForContext('someprofile', 'dafda')
        assert.equal(actualQuery.$and[1].context.$eq, 'dafda')
    })

})
