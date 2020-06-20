const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('profileCache : getById', async(testArgs)=>{

    it('happy path : gets profile by id, already cached', async () => {
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            get : ()=>{
                return JSON.stringify({ foo: 'bardfd' })
            }
        })

        const profilesCache = require(_$+'cache/profile'),
            profile = await profilesCache.getById('some-id')

        assert.equal(profile.foo, 'bardfd')
    })

    it('happy path : gets profile by id, not cached', async () => {
        let cachedProfile

        // replace call to mongo
        inject.object(_$+'data/mongo/profile', {
            getById : (id)=>{
                return { id }
            }
        })

        // capture call to cache
        inject.object(_$+'helpers/cache', {
            add : (key, profile)=>{
                cachedProfile = JSON.parse(profile)
            },
            // return null to force data call
            get : ()=>{
                return null 
            }
        })

        const profilesCache = require(_$+'cache/profile'),
            profile = await profilesCache.getById('some-id22')

        assert.equal(profile.id, 'some-id22')
        assert.equal(cachedProfile.id, 'some-id22')        
    })

})
