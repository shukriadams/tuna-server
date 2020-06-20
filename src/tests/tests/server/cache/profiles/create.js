const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('cache/profiles/create', async(testArgs)=>{

    it('happy path : creates and caches profile', async () => {
        let actualProfile,
            profilesCache = require(_$+'cache/profile')

        // replace call to mongo
        inject.object(_$+'data/mongo/profile', {
            create : (profile)=>{
                return profile
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            add : (key, json)=>{
                actualProfile = JSON.parse(json)
            }
        })

        await profilesCache.create({id : 'some-profile-create-id'})
        assert.equal(actualProfile.id, 'some-profile-create-id')
    })

})
