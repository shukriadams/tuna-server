const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokenCache : create', async(testArgs)=>{

    it('happy path : deletes an authToken', async () => {
        let authTokenCache = require(_$+'cache/authToken'),
            actualId = null

        // replace call to mongo
        inject.object(_$+'data/mongo/authToken', {
            deleteForProfile : (id)=> {
                actualId = id
            }
        })

        await authTokenCache.deleteForProfile('something')

        assert.notNull(actualId)
    })

})
