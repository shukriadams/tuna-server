const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('songsCache : createMany', async(testArgs)=>{

    it('happy path : creates and caches profile', async () => {

        let called = false,
            songsCache = require(_$+'cache/songs')

        // replace call to mongo
        inject.object(_$+'data/mongo/songs', {
            createMany : (songs)=>{
                return songs
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            remove : ()=>{
                called = true
            }
        })

        await songsCache.createMany([{profileId : 'some-songs-create-id'}])
        assert.true(called)
    })

})
