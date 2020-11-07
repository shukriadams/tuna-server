describe('route/stream', async()=>{
    

    it('route/stream::happy::streams a song', async ()=>{
        
        let actualMediaPath,
            actualProfileId,
            ctx = require(_$t+'testcontext'),
            route = require(_$+'routes/stream'),
            RouteTester = require(_$t+'helpers/routeTester'),
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


    it('route/stream::unhappy::auth failure', async ()=>{
        const authedRouteTest = require(_$t+'helpers/authedRouteTester')
        await authedRouteTest(_$+'routes/stream','get', '/v1/stream/:authToken/:mediaPath')
    })
    

    
})
