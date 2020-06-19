const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('profilesCache : getAll', async(testArgs)=>{

    it('happy path : gets all profiles', async () => {
        // replace call to mongo
        inject.object(_$+'data/mongo/profile', {
            getAll : ()=>{
                return { id : 'some-id3' }
            }
        })

        const profilesCache = require(_$+'cache/profile'),
            profiles = await profilesCache.getAll()

        assert.equal(profiles.id, 'some-id3')
    })

})
