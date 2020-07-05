const
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/sandbox/lastfmTokenSwap', async(ctx)=>{
    
    it('route/sandbox/lastfmTokenSwap::happy    route returns token object', async () => {
        
        // enable sandbox mode to allow sandbox route binding
        ctx.inject.object(_$+'helpers/settings', {
            musicSourceSandboxMode : true
        })

        const route = require(_$+'routes/sandbox'),
            routeTester = await new RouteTester(route)

        await routeTester.post('/v1/sandbox/lastfmTokenSwap')

        ctx.assert.includes(routeTester.res.content, '<lfm status="ok">')
    })

})
