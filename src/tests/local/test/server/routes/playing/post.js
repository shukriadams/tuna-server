describe('route/playing', async()=>{
    
    it('route/playing::happy::sets which song is currently playing', async ()=>{
        
        let ctx = require(_$t+'testcontext'),
            route = require(_$+'routes/playing'),
            RouteTester = require(_$t+'lib/routeTester'),
            actualSongId,
            actualProfileId,
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.body.song = 'slaughter of the soul'

        ctx.inject.object(_$+'lib/playMetrics', {
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

    
    it('route/playing::unhappy::auth failure', async ()=>{
        const authedRouteTest = require(_$t+'lib/authedRouteTester')
        await authedRouteTest(_$+'routes/playing','post', '/v1/playing')
    })
})

