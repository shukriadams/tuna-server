const 
    assert = require('madscience-node-assert'),
    RouteTester = require(_$t+'helpers/routeTester'),
    requireMock = require(_$t+'helpers/require'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/sandbox/dropboxTokenSwap', async(testArgs)=>{

    
    it('happy path : route returns token object', async () => {
        
        // enable sandbox mode to allow sandbox route binding
        requireMock.add(_$+'helpers/settings', {
            musicSourceSandboxMode : true
        })

        const route = require(_$+'routes/sandbox'),
            routeTester = await new RouteTester(route)

        await routeTester.post('/v1/sandbox/dropboxTokenSwap')

        assert.equal(routeTester.res.content.uid, '12345')
    })
})

