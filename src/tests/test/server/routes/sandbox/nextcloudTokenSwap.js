describe('route/sandbox/nextcloudTokenSwap', async()=>{
    
    it('route/sandbox/nextcloudTokenSwap::happy::route returns token object', async () => {
        const ctx = require(_$t+'testcontext'),
            RouteTester = require(_$t+'helpers/routeTester')

        // enable sandbox mode to allow sandbox route binding
        ctx.inject.object(_$+'helpers/settings', {
            sandboxMode : true
        })
        
        const route = require(_$+'routes/sandbox'),
            routeTester = await new RouteTester(route)

        await routeTester.post('/v1/sandbox/nextcloudTokenSwap')

        ctx.assert.equal(routeTester.res.content.uid, '12345')
    })

})

