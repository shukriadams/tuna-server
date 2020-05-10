const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/settings'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/settings/get', async(testArgs)=>{
    
    it('route/settings/get : happy path : gets settings', async () => {
        
        let routeTester = await new RouteTester(route);
        
        routeTester.route.sourceProvider.get =()=>{ 
            return {
                getLabel(){ return 5678 }
            }; 
        }

        await routeTester.get('/v1/settings');

        assert.equal(routeTester.res.content.payload.sourceLabel, 5678 );
    });
    
});