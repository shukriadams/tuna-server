const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('cache/songs/delete', async(testArgs)=>{

    it('happy path : deletes a songs', async () => {
        let called = false,
            actualSongId,
            songsCache = require(_$+'cache/songs')

        // replace call to mongo
        inject.object(_$+'data/mongo/songs', {
            delete : (songId)=>{
                actualSongId = songId
            }
        })
        
        // capture call to cache
        inject.object(_$+'helpers/cache', {
            remove : (key, json)=>{
                called = true
            }
        })

        await songsCache.delete({ id : 'some-delete-id'})

        assert.equal(actualSongId, 'some-delete-id')
        assert.true(called)
    })

})
