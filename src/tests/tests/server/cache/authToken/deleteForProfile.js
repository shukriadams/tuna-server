const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokenCache : deleteForProfile', async(testArgs)=>{

    it('happy path : deletes an authToken', async () => {
        // replace call to mongo
        inject.object(_$+'data/mongo/authToken', {
            deleteForProfile : (id)=> {
                actualId = id
            }
        })

        let authTokenCache = require(_$+'cache/authToken'),
            actualId = null

        await authTokenCache.deleteForProfile('something')

        assert.notNull(actualId)
    })

})
