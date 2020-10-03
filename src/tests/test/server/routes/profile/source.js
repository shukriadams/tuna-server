describe('route/profile/source/delete', async()=>{
    
    it('route/profile/source/delete::happy::route removes dropbox integration from profile and returns updated user content', async () => {
        const ctx = require(_$t+'testcontext'),
            RouteTester = require(_$t+'helpers/routeTester')

        ctx.inject.object(_$+'logic/profiles', {
            // prevent deleteSource from cascading further down stack
            deleteSource (){ } 
        })

        // log user in, set some content to get back after deleting dropbox
        const route = require(_$+'routes/profile'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.setUserContent({ someUserContent : 'new content'})

        await routeTester.delete('/v1/profile/source')

        ctx.assert.equal(routeTester.res.content.payload.someUserContent, 'new content')
    })

    it('route/playing::unhappy::auth failure', async ()=>{
        const authedRouteTest = require(_$t+'helpers/authedRouteTester')
        authedRouteTest(_$+'routes/profile','delete', '/v1/profile/source')
    })

})
