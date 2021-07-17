describe('route/sandbox/lastfmAuthenticate', async(ctx)=>{
    
    it('route/sandbox/lastfmAuthenticate::happy::route directs', async () => {
        const ctx = require(_$t+'testcontext')

        // enable sandbox mode to allow sandbox route binding
        ctx.inject.object(_$+'lib/settings', {
            sandboxMode : true
        })

        const route = require(_$+'routes/sandbox'),
            RouteTester = require(_$t+'lib/routeTester'),
            routeTester = await new RouteTester(route)

        await routeTester.get('/v1/sandbox/lastfmAuthenticate')

        ctx.assert.notNull(routeTester.res.redirected)
    })

})
