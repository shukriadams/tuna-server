const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/songs'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/songs/nowplaying', async(testArgs)=>{
    
    it('route/songs/nowplaying : happy path : sets which song is currently playing', async ()=>{
        
        let routeTester = await new RouteTester(route);
        routeTester.authenticate();
        routeTester.req.body.song = 'slaughter of the soul';

        let actualSongId,
            actualProfileId;

        routeTester.route.songsLogic.nowPlaying=(profileId, song)=>{
            actualSongId = song;
            actualProfileId = profileId;
        }

        await routeTester.post('/v1/songs/nowplaying');

        assert.equal(actualSongId, 'slaughter of the soul');
        assert.equal(actualProfileId, routeTester.authToken.profileId );
        assert.equal(routeTester.res.content.code, 0 );        
    });
    
});