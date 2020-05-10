const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/playlists'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/playlists/delete', async(testArgs)=>{
    
    it('route/playlists/delete : happy path : deletes a playlist, returns user content', async () => {
        
        let routeTester = await new RouteTester(route);
        routeTester.authenticate();
        // this would be a route parameter in actual express
        routeTester.req.params.playlistId = 'myplaylistId';
        // read back actual values sent to playlist create
        let actualPlaylistId,
            actualTokenId,
            actualProfileId;

        routeTester.route.playlistLogic.delete = (playlistId, profileId, authTokenId)=>{
            actualPlaylistId = playlistId;
            actualProfileId = profileId;
            actualTokenId = authTokenId;
        }

        // return some user content
        routeTester.route.profileLogic.buildUserContent = ()=>{ return { someUserContent : 'shadows in the deep' } }

        await routeTester.delete('/v1/playlists/:playlistId');

        assert.equal(actualPlaylistId, 'myplaylistId');
        assert.equal(actualTokenId, routeTester.authToken.id);
        assert.equal(actualProfileId, routeTester.authToken.profileId );
        assert.equal(routeTester.res.content.payload.someUserContent, 'shadows in the deep' );
    });
    
});