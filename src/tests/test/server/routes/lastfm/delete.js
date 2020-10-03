describe('route/lastfm/delete', async()=>{
    
    it('route/lastfm/delete:happy::removes lastfm integration', async () => {
        const ctx = require(_$t+'testcontext'),
            route = require(_$+'routes/lastfm'),
            RouteTester = require(_$t+'helpers/routeTester')
    
        ctx.inject.object(_$+'logic/profiles', {
            // prevent delete from cascading to db
            removeLastfm : ()=>{ } 
        })

        const routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.setUserContent({ someUserContent : 'left hand path'})

        await routeTester.delete('/v1/lastfm')
        ctx.assert.equal(routeTester.res.content.payload.someUserContent, 'left hand path')
    })

    it('route/playing::unhappy::auth failure', async ()=>{
        const authedRouteTest = require(_$t+'helpers/authedRouteTester')
        await authedRouteTest(_$+'routes/lastfm','delete', '/v1/lastfm')
    })

})
