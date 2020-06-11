const 
    assert = require('madscience-node-assert'),
    RouteTester = require(_$t+'helpers/routeTester'),
    requireMock = require(_$t+'helpers/require'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/playlists/delete', async(testArgs)=>{
    
    it('route/playlists/delete : happy path : deletes a playlist, returns user content', async () => {

        let actualPlaylistId,
            actualTokenId,
            actualProfileId,
            route = require(_$+'routes/playlists'),
            routeTester = await new RouteTester(route)
            playlistLogic = require(_$+'logic/playlists')

        playlistLogic.delete = (playlistId, profileId, authTokenId)=>{
            actualPlaylistId = playlistId
            actualProfileId = profileId
            actualTokenId = authTokenId
        }
        requireMock.add(_$+'logic/playlists', playlistLogic)
        
        // return some user content
        routeTester.authenticate()
        routeTester.setUserContent({ someUserContent : 'shadows in the deep' })
        
        // this would be a route parameter in actual express
        routeTester.req.params.playlistId = 'myplaylistId'
        // read back actual values sent to playlist create

        await routeTester.delete('/v1/playlists/:playlistId')

        assert.equal(actualPlaylistId, 'myplaylistId')
        assert.equal(actualTokenId, routeTester.authToken.id)
        assert.equal(actualProfileId, routeTester.authToken.profileId )
        assert.equal(routeTester.res.content.payload.someUserContent, 'shadows in the deep' )
    })
    
})
