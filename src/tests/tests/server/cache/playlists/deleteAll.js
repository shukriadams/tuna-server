const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('playlistCache : deleteAll', async(testArgs)=>{

    it('happy path : deletes all profile playlists', async () => {
        let called = false,
            actualProfileId,
            playlistCache = require(_$+'cache/playlist')

        // replace call to mongo
        inject.object(_$+'data/mongo/playlist', {
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

        await playlistCache.deleteAll('dfefg')

        assert.equal(actualProfileId, 'dfefg')
        assert.true(called)
    })

})
