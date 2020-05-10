const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/playlists'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/playlists/post', async(testArgs)=>{
    
    it('route/playlists/post : happy path : creates a playlist, returns user content', async () => {
        
        let routeTester = await new RouteTester(route);
        routeTester.authenticate();
        // this is our playlist content
        routeTester.req.body = { foo : 'bar' };

        // read back actual values sent to playlist create
        let actualPlaylist,
            actualProfileId;

        routeTester.route.playlistLogic.create = (playlist, profileId )=>{
            actualPlaylist = playlist;
            actualProfileId = profileId;
        }

        // return some user content
        routeTester.route.profileLogic.buildUserContent = ()=>{ return { someUserContent : 'override the overture' } }

        await routeTester.post('/v1/playlists');

        assert.equal(actualPlaylist.foo, 'bar');
        assert.equal(actualProfileId, routeTester.authToken.profileId );
        assert.equal(routeTester.res.content.payload.someUserContent, 'override the overture' );
    });

    
    it('route/playlists/post : happy path : updates a playlist, returns user content', async () => {
        
        let routeTester = await new RouteTester(route);
        routeTester.authenticate();
        // this is our playlist content. setting an id will switch from create to update
        routeTester.req.body = { bar : 'foo', id : 123 };

        // read back actual values sent to playlist create
        let actualPlaylist;

        routeTester.route.playlistLogic.update = (playlist)=>{
            actualPlaylist = playlist;
        }

        // return some user content
        routeTester.route.profileLogic.buildUserContent = ()=>{ return { someUserContent : 'soulless' } }

        await routeTester.post('/v1/playlists');

        assert.equal(actualPlaylist.bar, 'foo');
        assert.equal(routeTester.res.content.payload.someUserContent, 'soulless' );
    });
    
});