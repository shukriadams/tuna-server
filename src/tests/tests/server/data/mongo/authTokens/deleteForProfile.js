const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('mongo/authTokens/deleteForProfile', async(testArgs)=>{

    it('happy path : deletes authTokens for profile', async () => {
        let authTokenMongo = require(_$+'data/mongo/authToken'),
            actualQuery 

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            deleteMany : (collection, query)=>{
                actualQuery = query
            }
        })
        
        await authTokenMongo.deleteForProfile('dafda')
        assert.equal(actualQuery.profileId, 'dafda')
    })

})
