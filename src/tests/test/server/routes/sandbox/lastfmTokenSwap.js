describe('route/sandbox/lastfmTokenSwap', async()=>{
    
    it('route/sandbox/lastfmTokenSwap::happy::route returns token object', async () => {
        const ctx = require(_$t+'testcontext')

        // enable sandbox mode to allow sandbox route binding
        ctx.inject.object(_$+'helpers/settings', {
            sandboxMode : true
        })

        const route = require(_$+'routes/sandbox'),
            RouteTester = require(_$t+'helpers/routeTester'),
            routeTester = await new RouteTester(route)

        await routeTester.get('/v1/sandbox/lastfmTokenSwap')

        ctx.assert.includes(routeTester.res.content, '<lfm status="ok">')
    })

})
