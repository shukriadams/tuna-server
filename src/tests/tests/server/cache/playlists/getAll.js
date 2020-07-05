const mocha = require(_$t+'helpers/testbase')

mocha('cache/playlists/getAll', async(ctx)=>{

    it('cache/playlists/getAll::happy    gets all playlists, already cached', async () => {
        
        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            get(){
                return JSON.stringify({ foo: 'bar' })
            }
        })

        const playlistCache = require(_$+'cache/playlist'),
            playlist = await playlistCache.getAll('some-id')

        ctx.assert.equal(playlist.foo, 'bar')
    })




    it('cache/playlists/getAll::happy    gets all playlists, not cached', async () => {
        let cachedPlaylist

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/playlist', {
            getForProfile(id){
                return { id }
            }
        })

        // capture call to cache
        ctx.inject.object(_$+'helpers/cache', {
            add(key, authToken){
                cachedPlaylist = JSON.parse(authToken)
            },
            // return null to force data call
            get(){
                return null 
            }
        })

        const playlistCache = require(_$+'cache/playlist'),
            playlist = await playlistCache.getAll('some-id2')

        ctx.assert.equal(playlist.id, 'some-id2')
        ctx.assert.equal(cachedPlaylist.id, 'some-id2')        
    })

})
