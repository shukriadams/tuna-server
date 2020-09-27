describe('route/settings/get', async()=>{
    
    it('route/settings/get::happy::gets settings', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'helpers/sourceProvider', {
            get (){ 
                return {
                    getLabel(){ return 5678 }
                }
            }
        }) 

        const route = require(_$+'routes/settings'),
            RouteTester = require(_$t+'helpers/routeTester'),
            routeTester = await new RouteTester(route)

        await routeTester.get('/v1/settings')
        ctx.assert.equal(routeTester.res.content.payload.sourceLabel, 5678 )
    })
    
})
