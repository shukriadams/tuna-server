describe('logic/playlists/update', async()=>{

    it('logic/playlists/update::happy::updates playlist', async () => {

        // replace call to mongo
        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/playlists'),
            actualPlaylist

        ctx.inject.object(_$+'cache/playlist', {
            update (playlist){
                actualPlaylist = playlist
            }
        })

        await logic.update({ name : 'my-playlist', profileId : 'some-profile' })

        ctx.assert.equal(actualPlaylist.name, 'my-playlist')
        ctx.assert.equal(actualPlaylist.profileId, 'some-profile')
    })




    it('logic/playlists/update::unhappy::updates playlist, no playlist', async () => {
        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/playlists'),
            exception = await ctx.assert.throws(async () => await logic.update(null) )
        
        ctx.assert.equal(exception.log, 'playlist required')
    })




    it('logic/playlists/update::unhappy::updates playlist, no profile', async () => {
        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/playlists'),
            exception = await ctx.assert.throws(async () => await logic.update({ name : 'my-playlist', notAProfile: 'some-profile' }) )
        
        ctx.assert.equal(exception.log, 'profileId required')
    })




    it('logic/playlists/update::unhappy::updates playlist, no playlist name', async () => {
        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/playlists'),
            exception = await ctx.assert.throws(async () => await logic.update( { notAName : 'my-playlist', profileId: 'some-profile' }) )
        
        ctx.assert.equal(exception.log, 'name required')
    })

})
