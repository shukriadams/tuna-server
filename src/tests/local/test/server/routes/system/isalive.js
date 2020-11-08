describe('route/system/isalive', async()=>{
    
    it('route/system/isalive::happy::gets alive status', async () => {
        const ctx = require(_$t+'testcontext'),
            route = require(_$+'routes/system'),
            RouteTester = require(_$t+'helpers/routeTester'),
            routeTester = await new RouteTester(route)
       
        await routeTester.get('/v1/system/isalive')

        ctx.assert.equal(routeTester.res.content, 'yeah, I\'m alive' )
    })
    
})
