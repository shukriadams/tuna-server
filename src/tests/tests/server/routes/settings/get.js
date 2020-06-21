const 
    route = require(_$+'routes/settings'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/settings/get', async(ctx)=>{
    
    it('route/settings/get::happy    gets settings', async () => {
        
        ctx.inject.object(_$+'helpers/sourceProvider', {
            get (){ 
                return {
                    getLabel(){ return 5678 }
                }
            }
        }) 

        const routeTester = await new RouteTester(route)
        await routeTester.get('/v1/settings')
        ctx.assert.equal(routeTester.res.content.payload.sourceLabel, 5678 )
    })
    
})
