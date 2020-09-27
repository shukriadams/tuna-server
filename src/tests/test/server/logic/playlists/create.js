const mocha = require(_$t+'helpers/testbase')

mocha('logic/playlists/create', async(ctx)=>{

    it('logic/playlists/create::happy    creates playlist', async () => {

        // replace call to mongo
        let logic = require(_$+'logic/playlists'),
            actualPlaylist

        ctx.inject.object(_$+'cache/playlist', {
            create (playlist){
                actualPlaylist = playlist
            }
        })

        await logic.create({ name : 'my-playlist'}, 'some-profile')

        ctx.assert.equal(actualPlaylist.name, 'my-playlist')
        ctx.assert.equal(actualPlaylist.profileId, 'some-profile')
    })




    it('logic/playlists/create:unhappy    creates playlist, no playlist', async () => {
        let logic = require(_$+'logic/playlists'),
            exception = await ctx.assert.throws(async () => await logic.create(null, 'some-profile') )
        
        ctx.assert.equal(exception.log, 'playlist required')
    })




    it('logic/playlists/create::unhappy    creates playlist, no profile', async () => {
        let logic = require(_$+'logic/playlists'),
            exception = await ctx.assert.throws(async () => await logic.create({ name : 'my-playlist'}) )
        
        ctx.assert.equal(exception.log, 'profileId required')
    })




    it('logic/playlists/create::unhappy    creates playlist, no playlist name', async () => {
        let logic = require(_$+'logic/playlists'),
            exception = await ctx.assert.throws(async () => await logic.create({ notAName : 'my-playlist'}, 'some-profile') )
        
        ctx.assert.equal(exception.log, 'name required')
    })

})
