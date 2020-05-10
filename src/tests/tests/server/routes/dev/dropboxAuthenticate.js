const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/dev'),
    constants = require(_$+'types/constants'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/dev/dropboxAuthenticate', async(testArgs)=>{

    
    it('happy path : route directs', async () => {
        
        let routeTester = await new RouteTester(route);
        
        // route will not pass without a token of some kind
        routeTester.route.settings.dropboxDevOauthToken = 'placeholdertoken';

        await routeTester.get('/v1/dev/dropboxAuthenticate');

        assert.notNull(routeTester.res.redirected);
    });
    

    it('unhappy path : route returns json response with permission denied code', async () => {
        
        let routeTester = await new RouteTester(route);
        
        // route will throw permission exception if no dev token set
        routeTester.route.settings.dropboxDevOauthToken = null;

        await routeTester.get('/v1/dev/dropboxAuthenticate');

        assert.equal(routeTester.res.content.code, constants.ERROR_PERMISSION_DENIED);
    });
});