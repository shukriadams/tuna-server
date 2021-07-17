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

    /***
     * hits a line for test coverage
     */
    it('cache/songs/getAll::happy::cache hit', async () => {
        const ctx = require(_$t+'testcontext')
        
        // force cache to return value
        ctx.inject.object(_$+'lib/cache', {
            get (){
                return JSON.stringify({ id : 'some-id4' })
            }
        })
        
        const songsCache = require(_$+'cache/songs'),
        songs = await songsCache.getAll()

        ctx.assert.equal(songs.id, 'some-id4')
    })

})
