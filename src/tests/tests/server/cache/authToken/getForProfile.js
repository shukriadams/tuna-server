const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('cache/authTokens/getForProfile', async(testArgs)=>{

    it('happy path : gets authTokens by profile', async () => {
        const authTokenCache = require(_$+'cache/authToken')

        // replace call to mongo
        inject.object(_$+'data/mongo/authToken', {
            getForProfile : (profile)=>{
                return { profile }
            }
        })
        
        const authToken = await authTokenCache.getForProfile('profile1234')

        assert.equal(authToken.profile, 'profile1234')
    })

})
