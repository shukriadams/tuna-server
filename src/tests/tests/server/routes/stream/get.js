const 
    route = require(_$+'routes/stream'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/stream', async(ctx)=>{
    
    it('route/stream::happy    streams a song', async ()=>{
        
        let actualMediaPath,
            actualProfileId,
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.params.authToken = 'some-token'
        routeTester.req.params.mediaPath = Buffer.from('some/path').toString('base64')

        ctx.inject.object(_$+'logic/songs', {
            streamSong (profileId, mediaPath){
                actualMediaPath = mediaPath
                actualProfileId = profileId
            }
        }) 

        await routeTester.get('/v1/stream/:authToken/:mediaPath')

        ctx.assert.equal(actualMediaPath, 'some/path')
        ctx.assert.equal(actualProfileId, routeTester.authToken.profileId )
    })
    
})
