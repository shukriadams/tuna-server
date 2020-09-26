const 
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/sandbox/nextcloudTokenSwap', async(ctx)=>{
    
    it('route/sandbox/nextcloudTokenSwap::happy::route returns token object', async () => {
        
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

