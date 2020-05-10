const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/default'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('default route', async(testArgs)=>{

    // this is a simple route, it has only one outcome
    it('happy path : returns html', async () => {

        let routeTester = await new RouteTester(route);

        await routeTester.get(/^[^.]+$/);

        assert.includes(routeTester.res.content, '<html>');
    });
    
});