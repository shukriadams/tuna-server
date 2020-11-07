describe('route/sandbox/nextcloudAuthenticate', async(ctx)=>{
    
    it('route/sandbox/nextcloudAuthenticate::happy::route directs', async () => {
        const ctx = require(_$t+'testcontext'),
            RouteTester = require(_$t+'helpers/routeTester')

        // enable sandbox mode to allow sandbox route binding
        ctx.inject.object(_$+'helpers/settings', {
            sandboxMode : true
        })

        const route = require(_$+'routes/sandbox'),
            routeTester = await new RouteTester(route)

        await routeTester.get('/v1/sandbox/nextcloudAuthenticate')

        ctx.assert.notNull(routeTester.res.redirected)
    })

})
