const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('cache/authTokens/deleteForContext', async(testArgs)=>{

    it('happy path : deletes an authToken', async () => {
        let authTokenCache = require(_$+'cache/authToken'),
            actualprofile = null

        // replace call to mongo
        inject.object(_$+'data/mongo/authToken', {
            deleteForContext : (profile)=> {
                actualprofile = profile
            }
        })

        await authTokenCache.deleteForContext('something')

        assert.notNull(actualprofile)
    })

})
