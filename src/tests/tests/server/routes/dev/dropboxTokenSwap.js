const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/dev'),
    constants = require(_$+'types/constants'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/dev/dropboxTokenSwap', async(testArgs)=>{

    
    it('happy path : route returns token object', async () => {
        
        let routeTester = await new RouteTester(route);
        
        // route will not pass without a token of some kind
        routeTester.route.settings.dropboxDevOauthToken = 'placeholdertoken';

        await routeTester.post('/v1/dev/dropboxTokenSwap');

        assert.equal(routeTester.res.content.uid, '12345');
    });
    

    it('unhappy path : route returns json response with permission denied code', async () => {
        
        let routeTester = await new RouteTester(route);
        
        // route will throw permission exception if no dev token set
        routeTester.route.settings.dropboxDevOauthToken = null;

        await routeTester.post('/v1/dev/dropboxTokenSwap');

        assert.equal(routeTester.res.content.code, constants.ERROR_PERMISSION_DENIED);
    });
});