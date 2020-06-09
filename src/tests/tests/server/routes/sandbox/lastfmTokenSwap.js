const
    assert = require('madscience-node-assert'),
    RouteTester = require(_$t+'helpers/routeTester'),
    requireMock = require(_$t+'helpers/require'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/dev/lastfmTokenSwap', async(testArgs)=>{
    
    it('happy path : route returns token object', async () => {
        
        // enable sandbox mode to allow sandbox route binding
        requireMock.add(_$+'helpers/settings', {
            musicSourceSandboxMode : true
        })

        const route = require(_$+'routes/sandbox'),
            routeTester = await new RouteTester(route)

        await routeTester.post('/v1/sandbox/lastfmTokenSwap')

        assert.includes(routeTester.res.content, '<lfm status="ok">')
    })

})
