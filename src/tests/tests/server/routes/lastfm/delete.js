const 
    route = require(_$+'routes/lastfm'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/lastfm/delete', async(ctx)=>{
    
    it('route/lastfm/delete:happy    removes lastfm integration', async () => {
        ctx.inject.object(_$+'logic/profiles', {
            // prevent delete from cascading to db
            removeLastfm : ()=>{ } 
        })

        const routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.setUserContent({ someUserContent : 'left hand path'})

        await routeTester.get('/v1/lastfm/delete')
        ctx.assert.equal(routeTester.res.content.payload.someUserContent, 'left hand path')
    })

})
