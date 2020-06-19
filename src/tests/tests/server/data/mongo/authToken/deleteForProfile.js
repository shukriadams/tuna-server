const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokenData : deleteForProfile', async(testArgs)=>{

    it('happy path : deletes authTokens for profile', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            deleteMany : (collection, query)=>{
                return query
            }
        })

        let authTokenMongo = require(_$+'data/mongo/authToken'),
            actualQuery = await authTokenMongo.deleteForProfile('dafda')

        assert.equal(actualQuery.profileId, 'dafda')
    })

})
