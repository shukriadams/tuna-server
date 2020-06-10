const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/lastfm'),
    requireMock = require(_$t+'helpers/require'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/lastfm/delete', async(testArgs)=>{
    
    it('happy path : route removes lastfm integration from profile and returns updated user content', async () => {

        // prevent delete from cascading to db
        const profileLogic = require(_$+'logic/profiles')
        profileLogic.removeLastfm =()=>{ } // do nothing
        requireMock.add(_$+'logic/profiles', profileLogic)

        let routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.setUserContent({ someUserContent : 'left hand path'})

        await routeTester.get('/v1/lastfm/delete')
        assert.equal(routeTester.res.content.payload.someUserContent, 'left hand path')
    })

})
