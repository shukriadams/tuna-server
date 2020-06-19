const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('profilesCache : update', async(testArgs)=>{

    it('happy path : updates a profile', async () => {
        let called = false,
            profilesCache = require(_$+'cache/profile')

        // replace call to mongo
        inject.object(_$+'data/mongo/playlist', {
            update : (profile)=>{
                return profile
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            add : (key, json)=>{
                called = true
            }
        })

        const actualProfile = await profilesCache.create({ id : 'some-update-id' })

        assert.equal(actualProfile.id, 'some-update-id')
        assert.true(called)
    })

})
