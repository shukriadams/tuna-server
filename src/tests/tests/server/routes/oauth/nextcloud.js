/*

const 
    constants = require(_$+'types/constants'),
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/oauth'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/oauth/nextcloud', async(testArgs)=>{
    
    it('happy path : swap succeeds and redirects to next page ', async () => {
        
        let routeTester = await new RouteTester(route);
        // code to be converted to token
        routeTester.req.query.code = 'some-code';
        // combination of user's authtoken + page to redirect to
        routeTester.req.query.state = 'the-auth-token_the-page';

        routeTester.route.authTokenLogic.getById =()=>{ return { profileId: 'a-profile' }}

        // capture actual used profile and code
        let actualProfileId,
            actualCode;

        routeTester.route.nextCloudHelper.swapCodeForToken =(profileId, code)=>{ 
            actualProfileId = profileId;
            actualCode = code;
        }

        await routeTester.get('/v1/oauth/nextcloud');

        assert.equal(actualCode, 'some-code');
        assert.equal(actualProfileId, 'a-profile' );
        assert.equal(routeTester.res.redirected, '/the-page');
    });

    it('unhappy path : throws auth error authtoken invalid', async () => {
        
        let routeTester = await new RouteTester(route);
        // ensure authtoken is null
        routeTester.route.authTokenLogic.getById =()=>{ return null }

        await routeTester.get('/v1/oauth/nextcloud');
        
        assert.equal(routeTester.res.content.code, constants.ERROR_INVALID_USER_OR_SESSION);
    });

})

*/