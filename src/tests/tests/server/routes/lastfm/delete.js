const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/lastfm'),
    inject = require(_$t+'helpers/inject'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/lastfm/delete', async(testArgs)=>{
    
    it('happy path : route removes lastfm integration from profile and returns updated user content', async () => {


        inject.object(_$+'logic/profiles', {
            // prevent delete from cascading to db
            removeLastfm : ()=>{ } 
        })

        let routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.setUserContent({ someUserContent : 'left hand path'})

        await routeTester.get('/v1/lastfm/delete')
        assert.equal(routeTester.res.content.payload.someUserContent, 'left hand path')
    })

})
