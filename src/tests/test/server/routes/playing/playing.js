const 
    route = require(_$+'routes/playing'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/playing', async(ctx)=>{
    
    it('route/playing::happy::sets which song is currently playing', async ()=>{
        
        let actualSongId,
            actualProfileId,
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.body.song = 'slaughter of the soul'

        ctx.inject.object(_$+'helpers/playMetrics', {
            playing(profileId, song){
                actualSongId = song
                actualProfileId = profileId
            }
        }) 

        await routeTester.post('/v1/playing')

        ctx.assert.equal(actualSongId, 'slaughter of the soul')
        ctx.assert.equal(actualProfileId, routeTester.authToken.profileId )
        ctx.assert.null(routeTester.res.content.code)
    })
    
})

