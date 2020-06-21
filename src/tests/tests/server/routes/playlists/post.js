
const 
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/playlists/post', async(ctx)=>{
    
    it('route/playlists/post:: happy    creates a playlist, returns user content', async () => {
        // read back actual values sent to playlist create
        let actualPlaylist,
            actualProfileId,
            route = require(_$+'routes/playlists'),
            routeTester = await new RouteTester(route)

        ctx.inject.object(_$+'logic/playlists', {
            create (playlist, profileId ){
                actualPlaylist = playlist
                actualProfileId = profileId
            }
        })
        
        // return some user content
        routeTester.setUserContent({ someUserContent : 'override the overture' })
        routeTester.authenticate()
        
        // this is our playlist content
        routeTester.req.body = { foo : 'bar' }

        await routeTester.post('/v1/playlists')

        ctx.assert.equal(actualPlaylist.foo, 'bar')
        ctx.assert.equal(actualProfileId, routeTester.authToken.profileId )
        ctx.assert.equal(routeTester.res.content.payload.someUserContent, 'override the overture' )
    })



    
    it('route/playlists/post::happy    updates a playlist, returns user content', async () => {

        // read back actual values sent to playlist create
        let actualPlaylist,
            route = require(_$+'routes/playlists'),
            routeTester = await new RouteTester(route)

        ctx.inject.object(_$+'logic/playlists', {
            update (playlist){
                actualPlaylist = playlist
            }
        })

        // return some user content
        routeTester.setUserContent({ someUserContent : 'soulless' })
        routeTester.authenticate()

        // this is our playlist content. setting an id will switch from create to update
        routeTester.req.body = { bar : 'foo', id : 123 }

        await routeTester.post('/v1/playlists')

        ctx.assert.equal(actualPlaylist.bar, 'foo')
        ctx.assert.equal(routeTester.res.content.payload.someUserContent, 'soulless' )
    })
    
})

