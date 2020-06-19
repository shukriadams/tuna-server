const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('profilesCache : getByIdentifier', async(testArgs)=>{

    it('happy path : gets profile by identifier', async () => {
        // replace call to mongo
        inject.object(_$+'data/mongo/profile', {
            getByIdentifier : (identifier)=>{
                return { identifier }
            }
        })

        const profilesCache = require(_$+'cache/profile'),
            profiles = await profilesCache.getByIdentifier('some-identifier')

        assert.equal(profiles.identifier, 'some-identifier')
    })

})
