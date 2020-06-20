const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('cache/profiles/update', async(testArgs)=>{

    it('happy path : updates a profile', async () => {
        let called = false,
            actualProfile,
            profilesCache = require(_$+'cache/profile')

        // replace call to mongo
        inject.object(_$+'data/mongo/profile', {
            update : (profile)=>{
                actualProfile = profile
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            add : (key, json)=>{
                called = true
            }
        })

        await profilesCache.update({ id : 'some-update-id' })

        assert.equal(actualProfile.id, 'some-update-id')
        assert.true(called)
    })

})
