const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('profilesCache : delete', async(testArgs)=>{

    it('happy path : deletes a profile', async () => {
        let called = false,
            actualProfile,
            profilesCache = require(_$+'cache/profile')

        // replace call to mongo
        inject.object(_$+'data/mongo/profile', {
            delete : (profile)=>{
                actualProfile = profile
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            remove : (key, json)=>{
                called = true
            }
        })

        await profilesCache.delete({id : 'some-delete-id'})

        assert.equal(actualProfile.id, 'some-delete-id')
        assert.true(called)
    })

})
