const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('cache/authTokens/getById', async(testArgs)=>{

    it('happy path : gets authTokens by id, already cached', async () => {
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            get : ()=>{
                return JSON.stringify({ foo: 'bar' })
            }
        })

        const authTokenCache = require(_$+'cache/authToken'),
            authToken = await authTokenCache.getById('some-id')

        assert.equal(authToken.foo, 'bar')
    })

    it('happy path : gets authTokens by id, not cached', async () => {
        let cachedAuthToken

        // replace call to mongo
        inject.object(_$+'data/mongo/authToken', {
            getById : (id)=>{
                return { id }
            }
        })

        // capture call to cache
        inject.object(_$+'helpers/cache', {
            add : (key, authToken)=>{
                cachedAuthToken = JSON.parse(authToken)
            },
            // return null to force data call
            get : ()=>{
                return null 
            }
        })

        const authTokenCache = require(_$+'cache/authToken'),
            authToken = await authTokenCache.getById('some-id2')

        assert.equal(authToken.id, 'some-id2')
        assert.equal(cachedAuthToken.id, 'some-id2')        
    })

})
