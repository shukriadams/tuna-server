describe('route/content', async()=>{
    
    it('route/content/songs::happy::gets user content', async () => {
        
        let ctx = require(_$t+'testcontext'),
            route = require(_$+'routes/content'),
            RouteTester = require(_$t+'helpers/routeTester'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.query.token = 5829

        ctx.inject.object(_$+'logic/songs', {
            getAll () { 
                return [ { test : 123 }]
            }
        })

        await routeTester.get('/v1/content/songs')
        ctx.assert.equal(routeTester.res.content.payload.songs[0].test, 123 )        
    })


    it('route/content/songs::unhappy::auth failure', async ()=>{
        const authedRouteTest = require(_$t+'helpers/authedRouteTester')
        await authedRouteTest(_$+'routes/content', 'get', '/v1/content/songs')
    })
})

