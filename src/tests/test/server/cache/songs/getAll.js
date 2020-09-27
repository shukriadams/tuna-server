describe('cache/songs/getAll', async()=>{

    it('cache/songs/getAll::happy::gets all songs', async () => {
        const ctx = require(_$t+'testcontext')
        
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
