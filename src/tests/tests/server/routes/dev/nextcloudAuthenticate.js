const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/dev'),
    constants = require(_$+'types/constants'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/dev/nextcloudAuthenticate', async(testArgs)=>{

    
    it('happy path : route directs', async () => {
        
        let routeTester = await new RouteTester(route);
        
        // route will not pass without a token of some kind
        routeTester.route.settings.nextCloudDevAccessToken = 'placeholdertoken';
        routeTester.route.settings.nextCloudDevRefreshToken = 'placeholdertoken';

        await routeTester.get('/v1/dev/nextcloudAuthenticate');

        assert.notNull(routeTester.res.redirected);
    });
    

    it('unhappy path : route returns json response with permission denied code', async () => {
        
        let routeTester = await new RouteTester(route);
        
        // route will throw permission exception if no dev token set
        routeTester.route.settings.nextCloudDevAccessToken = null;
        routeTester.route.settings.nextCloudDevRefreshToken = null;

        await routeTester.get('/v1/dev/nextcloudAuthenticate');

        assert.equal(routeTester.res.content.code, constants.ERROR_PERMISSION_DENIED);
    });
});