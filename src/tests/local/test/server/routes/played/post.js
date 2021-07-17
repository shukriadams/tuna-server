describe('route/played/get', async()=>{
    
    it('route/played/post::happy::registers a play', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'lib/playMetrics', {
            played (){ 
                return 654
            }
        }) 

        const route = require(_$+'routes/played'),
            RouteTester = require(_$t+'helpers/routeTester'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        await routeTester.post('/v1/played')

        ctx.assert.equal(routeTester.res.content.payload.result, 654 )
    })

    
    it('route/playing::unhappy::auth failure', async ()=>{
        const authedRouteTest = require(_$t+'helpers/authedRouteTester')
        await authedRouteTest(_$+'routes/played', 'post', '/v1/played')
    })
})
