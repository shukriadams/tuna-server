
const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokenCache : create', async(testArgs)=>{

    it('happy path : creates and caches authToken', async () => {
        let actualAuthToken,
            authTokenCache = require(_$+'cache/authToken')

        // replace call go mongo
        inject.object(_$+'data/mongo/authToken', {
            create : (authToken)=>{
                return authToken
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            add : (key, json)=>{
                actualAuthToken = JSON.parse(json)
            }
        })

        await authTokenCache.create({id : 'some-id'})

        assert.equal(actualAuthToken.id, 'some-id')
    })

})
