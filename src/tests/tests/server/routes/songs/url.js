/*

const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/songs'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/songs/url', async(testArgs)=>{
    
    it('route/songs/url : happy path : gets a songs url', async ()=>{
        
        let routeTester = await new RouteTester(route);
        routeTester.authenticate();
        routeTester.req.query.song = 'blinded by fear';

        let actualSongId,
            actualProfileId,
            actualAuthTokenId;

        routeTester.route.songsLogic.getSongUrl = (songId, profileId, authTokenId)=>{
            actualSongId = songId;
            actualProfileId = profileId;
            actualAuthTokenId = authTokenId;
            return 'the-url';
        }

        await routeTester.get('/v1/songs/url');

        assert.equal(actualSongId, 'blinded by fear');
        assert.equal(actualProfileId, routeTester.authToken.profileId );
        assert.equal(actualAuthTokenId, routeTester.authToken.id );
        assert.equal(routeTester.res.content.payload.url, 'the-url' );
    });
    
})

*/