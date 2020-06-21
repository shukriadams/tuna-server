const RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/dropbox/delete', async(ctx)=>{
    
    it('route/dropbox/delete::happy    route removes dropbox integration from profile and returns updated user content', async () => {

        ctx.inject.object(_$+'logic/profiles', {
            // prevent deleteSource from cascading further down stack
            deleteSource : ()=>{ } 
        })

        // log user in, set some content to get back after deleting dropbox
        const route = require(_$+'routes/dropbox'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.setUserContent({ someUserContent : 'new content'})

        await routeTester.get('/v1/dropbox/delete')

        ctx.assert.equal(routeTester.res.content.payload.someUserContent, 'new content')
    })

})
