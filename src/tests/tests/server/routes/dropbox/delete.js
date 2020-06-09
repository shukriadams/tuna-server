const 
    assert = require('madscience-node-assert'),
    RouteTester = require(_$t+'helpers/routeTester'),
    requireMock = require(_$t+'helpers/require'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/dropbox/delete', async(testArgs)=>{
    
    it('happy path : route removes dropbox integration from profile and returns updated user content', async () => {

        // prevent deleteSource from cascading further down stack
        const profileLogic = require(_$+'logic/profiles')
        profileLogic.deleteSource = ()=>{ } // do nothing
        requireMock.add(_$+'logic/profiles', profileLogic)

        // log user in, set some content to get back after deleting dropbox
        const route = require(_$+'routes/dropbox'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.setUserContent({ someUserContent : 'new content'})

        await routeTester.get('/v1/dropbox/delete')

        assert.equal(routeTester.res.content.payload.someUserContent, 'new content')
    })

})
