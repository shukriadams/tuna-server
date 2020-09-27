const 
    route = require(_$+'routes/system'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/system/isalive', async(ctx)=>{
    
    it('route/system/isalive::happy    gets alive status', async () => {
        
        const routeTester = await new RouteTester(route)
       
        await routeTester.get('/v1/system/isalive')

        ctx.assert.equal(routeTester.res.content, 'yeah, I\'m alive' )
    })
    
})
