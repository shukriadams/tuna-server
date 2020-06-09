const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/sandbox'),
    RouteTester = require(_$t+'helpers/routeTester'),
    requireMock = require(_$t+'helpers/require'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/dev/dropboxAuthenticate', async(testArgs)=>{
    
    it('happy path : route directs', async () => {
        // enable sandbox mode to allow sandbox route binding
        requireMock.add(_$+'helpers/settings', {
            musicSourceSandboxMode : true
        })

        let routeTester = await new RouteTester(route)
        
        await routeTester.get('/v1/sandbox/dropboxAuthenticate')

        assert.notNull(routeTester.res.redirected)
    })

})
