const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokenCache : delete', async(testArgs)=>{

    it('happy path : deletes an authToken', async () => {
        let authTokenCache = require(_$+'cache/authToken'),
            actualId = null, 
            actualKey = null

        // replace call to mongo
        inject.object(_$+'data/mongo/authToken', {
            delete : (id)=> {
                actualId = id
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            remove : (key)=>{
                actualKey = key
            }
        })

        await authTokenCache.delete('something')

        assert.notNull(actualId)
        assert.notNull(actualKey)
    })

})
