const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/lastfm'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/lastfm/scrobble', async(testArgs)=>{

    
    it('happy path : scrobbles a play', async () => {
        
        let routeTester = await new RouteTester(route);
        // user must be logged in to scrobble
        routeTester.authenticate();     
        // this is the song data we expect to be scrobbled (passed by query string)
        routeTester.req.query.song = 'song1234';
        routeTester.req.query.songDuration = 'duration1234';

        // intercept the actual song data scrobbled
        let actualSong = null,
            actualProfileId = null,
            actualDuration = null;

        routeTester.route.songsLogic.scrobble =(profileId, song, duration)=>{ 
            actualSong = song;
            actualDuration = duration;
            actualProfileId = profileId;
        }

        await routeTester.get('/v1/lastfm/scrobble');

        assert.equal(actualSong, 'song1234');
        assert.equal(actualDuration, 'duration1234');
        assert.equal(actualProfileId, routeTester.authToken.profileId);
        // the payload for a scrobble is an empty object, confirm by ensuring it's an object with no properties
        assert.empty(Object.keys(routeTester.res.content.payload));
    });

});