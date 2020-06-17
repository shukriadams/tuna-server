const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/system'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/system/isalive', async(testArgs)=>{
    
    it('route/system/isalive : happy path : gets alive status', async () => {
        
        let routeTester = await new RouteTester(route)
       
        await routeTester.get('/v1/system/isalive')

        assert.equal(routeTester.res.content, 'yeah, I\'m alive' )
    })
    
})
