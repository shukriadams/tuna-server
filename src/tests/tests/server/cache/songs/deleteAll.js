const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('cache/songs/deleteAll', async(testArgs)=>{

    it('happy path : deletes all profile songs', async () => {
        let called = false,
            actualProfileId,
            songsCache = require(_$+'cache/songs')

        // replace call to mongo
        inject.object(_$+'data/mongo/songs', {
            deleteForProfile : (profileId)=>{
                actualProfileId = profileId
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            remove : (key, json)=>{
                called = true
            }
        })

        await songsCache.deleteForProfile('fgsfg')

        assert.equal(actualProfileId, 'fgsfg')
        assert.true(called)
    })

})
