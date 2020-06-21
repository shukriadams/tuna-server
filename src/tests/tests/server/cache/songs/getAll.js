const mocha = require(_$t+'helpers/testbase')

mocha('cache/songs/getAll', async(ctx)=>{

    it('cache/songs/getAll::happy    gets all songs', async () => {
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/songs', {
            getAll (){
                return { id : 'some-id3' }
            }
        })

        const songsCache = require(_$+'cache/songs'),
            songs = await songsCache.getAll()

        ctx.assert.equal(songs.id, 'some-id3')
    })

})
