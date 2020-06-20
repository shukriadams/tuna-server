const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokenData : getForProfile', async(testArgs)=>{

    it('happy path : gets authTokens for profile', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            find : (collection, query)=>{
                return [{query, _id : 'some-id'}]
            }
        })
        
        let authTokenMongo = require(_$+'data/mongo/authToken'),
            authTokens = await authTokenMongo.getForProfile('dafda')

        assert.equal(authTokens[0].id, 'some-id')
    })

})
