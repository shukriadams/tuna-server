const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/songs'),
    inject = require(_$t+'helpers/inject'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/songs/nowplaying', async(testArgs)=>{
    
    it('route/songs/nowplaying : happy path : sets which song is currently playing', async ()=>{
        
        let actualSongId,
            actualProfileId,
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.body.song = 'slaughter of the soul'

        inject.object(_$+'logic/songs', {
            nowPlaying : (profileId, song)=>{
                actualSongId = song
                actualProfileId = profileId
            }
        }) 

        await routeTester.post('/v1/songs/nowplaying')

        assert.equal(actualSongId, 'slaughter of the soul')
        assert.equal(actualProfileId, routeTester.authToken.profileId )
        assert.null(routeTester.res.content.code)
    })
    
})

