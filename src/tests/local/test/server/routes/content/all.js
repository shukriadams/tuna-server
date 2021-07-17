describe('route/content', async()=>{
    
    it('route/content/all::happy::gets user content', async () => {
        
        let ctx = require(_$t+'testcontext'),
            route = require(_$+'routes/content'),
            RouteTester = require(_$t+'lib/routeTester'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.query.token = 5829

        ctx.inject.object(_$+'lib/content', {
            build () { 
                return { myproperty: 5631 } 
            }
        })

        await routeTester.get('/v1/content/all/:requestedContent')
        ctx.assert.equal(routeTester.res.content.payload.myproperty, 5631 )        
    })


    it('route/content/all::unhappy::auth failure', async ()=>{
        const authedRouteTest = require(_$t+'lib/authedRouteTester')
        await authedRouteTest(_$+'routes/content', 'get', '/v1/content/all/:requestedContent')
    })
})

