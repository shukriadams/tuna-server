const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/songs'),
    inject = require(_$t+'helpers/inject'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/songs/stream', async(testArgs)=>{
    
    it('route/songs/stream : happy path : streams a song', async ()=>{
        
        let actualMediaPath,
            actualProfileId,
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.params.authToken = 'some-token'
        routeTester.req.params.mediaPath = Buffer.from('some/path').toString('base64')

        inject.object(_$+'logic/songs', {
            streamSong : (profileId, mediaPath, res)=>{
                actualMediaPath = mediaPath
                actualProfileId = profileId
            }
        }) 

        await routeTester.get('/v1/songs/stream/:authToken/:mediaPath')

        assert.equal(actualMediaPath, 'some/path')
        assert.equal(actualProfileId, routeTester.authToken.profileId )
    })
    
})
