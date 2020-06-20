const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('cache/songs/getAll', async(testArgs)=>{

    it('happy path : gets all songs', async () => {
        
        // replace call to mongo
        inject.object(_$+'data/mongo/songs', {
            getAll : ()=>{
                return { id : 'some-id3' }
            }
        })

        const songsCache = require(_$+'cache/songs'),
            songs = await songsCache.getAll()

        assert.equal(songs.id, 'some-id3')
    })

})
