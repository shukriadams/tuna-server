describe('route/playlists/delete', async()=>{
    
    it('route/playlists/delete::happy::deletes a playlist, returns user content', async () => {

        let ctx = require(_$t+'testcontext'),
            RouteTester = require(_$t+'helpers/routeTester'),
            actualPlaylistId,
            actualTokenId,
            actualProfileId,
            route = require(_$+'routes/playlists'),
            routeTester = await new RouteTester(route)
        
        // override delete to capture input
        ctx.inject.object(_$+'logic/playlists', {
            delete (playlistId, profileId, authTokenId){
                actualPlaylistId = playlistId
                actualProfileId = profileId
                actualTokenId = authTokenId
            }
        })

        // return some user content
        routeTester.authenticate()
        routeTester.setUserContent({ someUserContent : 'shadows in the deep' })
        
        // set route parameter for the playlist to delete
        routeTester.req.params.playlistId = 'myplaylistId'

        await routeTester.delete('/v1/playlists/:playlistId')

        ctx.assert.equal(actualPlaylistId, 'myplaylistId')
        ctx.assert.equal(actualTokenId, routeTester.authToken.id)
        ctx.assert.equal(actualProfileId, routeTester.authToken.profileId )
        ctx.assert.equal(routeTester.res.content.payload.someUserContent, 'shadows in the deep' )
    })
    
    it('route/playing::unhappy::auth failure', async ()=>{
        const authedRouteTest = require(_$t+'helpers/authedRouteTester')
        await authedRouteTest(_$+'routes/playlists','delete', '/v1/playlists/:playlistId')
    })
})
