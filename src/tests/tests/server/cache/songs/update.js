const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('cache/songs/update', async(testArgs)=>{

    it('happy path : updates a profile', async () => {
        let called = false,
            songsCache = require(_$+'cache/songs')

        // replace call to mongo
        inject.object(_$+'data/mongo/songs', {
            update : (profile)=>{
                return profile
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            remove : (key, json)=>{
                called = true
            }
        })

        const actualSong = await songsCache.update({ id : 'some-update-id' })

        assert.equal(actualSong.id, 'some-update-id')
        assert.true(called)
    })

})
