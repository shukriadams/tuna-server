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
        
        let ctx = require(_$t+'testcontext'),
            route = require(_$+'routes/stream'),
            RouteTester = require(_$t+'helpers/routeTester'),
            constants = require(_$+'types/constants'),
            routeTester = await new RouteTester(route)

        routeTester.req.params.authToken = 'an-invalid-token'
        routeTester.req.params.mediaPath = Buffer.from('some/path').toString('base64')

        await routeTester.get('/v1/stream/:authToken/:mediaPath')

        ctx.assert.equal(routeTester.res.content.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })
    

    
})
