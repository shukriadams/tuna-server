const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('profilesCache : getByPasswordResetKey', async(testArgs)=>{

    it('happy path : gets profile by identifier', async () => {
        // replace call to mongo
        inject.object(_$+'data/mongo/profile', {
            getByPasswordResetKey : (resetKey)=>{
                return { resetKey }
            }
        })

        const profilesCache = require(_$+'cache/profile'),
            profiles = await profilesCache.getByPasswordResetKey('some-key')

        assert.equal(profiles.resetKey, 'some-key')
    })

})
