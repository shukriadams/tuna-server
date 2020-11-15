describe('route/sandbox/dropboxTokenSwap', async()=>{
    
    it('route/sandbox/dropboxTokenSwap::happy::route returns token object', async () => {
        const ctx = require(_$t+'testcontext')

        // enable sandbox mode to allow sandbox route binding
        ctx.inject.object(_$+'helpers/settings', {
            sandboxMode : true
        })

        const route = require(_$+'routes/sandbox'),
            RouteTester = require(_$t+'helpers/routeTester'),
            routeTester = await new RouteTester(route)

        await routeTester.post('/v1/sandbox/dropboxTokenSwap')

        ctx.assert.equal(routeTester.res.content.uid, '12345')
    })
})

