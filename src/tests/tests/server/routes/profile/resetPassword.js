/*

const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/profile'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/profiles/resetpassword', async(testArgs)=>{
    
    it('route/profiles/resetpassword : happy path : request a password reset if not logged in', async () => {
        
        let routeTester = await new RouteTester(route);
        // send only a key, this is all we need when reseting password
        routeTester.req.query.key='abcd';
        
        // disable brute force check
        routeTester.route.bruteForce.process=()=>{ } // do nothing
        routeTester.route.bruteForce.clear=()=>{ } // do nothing

        // read back actual values sent to playlist create
        let actualPassword = null,
            actualKey = null,
            actualProfileId = null,
            actualCurrentPassword = null;

        routeTester.route.profileLogic.resetPassword = (key, password, currentPassword, profileId)=>{
            actualPassword = password;
            actualKey = key;
            actualProfileId = profileId;
            actualCurrentPassword = currentPassword;
        }

        await routeTester.get('/v1/profile/resetPassword');

        assert.equal(actualKey, 'abcd');
        assert.null(actualPassword);
        assert.null(actualProfileId);
        assert.null(actualCurrentPassword);
        assert.equal(routeTester.res.content.code, 0 );
    });

    it('route/profiles/resetpassword : happy path : request a password reset if logged in', async () => {
        
        let routeTester = await new RouteTester(route);
        // need to be authenticated, and send current password and new password
        routeTester.authenticate();
        routeTester.req.query.password='abcd';
        routeTester.req.query.currentPassword='efgh';

        // disable brute force check
        routeTester.route.bruteForce.process=()=>{ } // do nothing
        routeTester.route.bruteForce.clear=()=>{ } // do nothing

        // read back actual values sent to playlist create
        let actualPassword = null,
            actualKey = null,
            actualProfileId = null,
            actualCurrentPassword = null;

        routeTester.route.profileLogic.resetPassword = (key, password, currentPassword, profileId)=>{
            actualPassword = password;
            actualKey = key;
            actualProfileId = profileId;
            actualCurrentPassword = currentPassword;
        }

        await routeTester.get('/v1/profile/resetPassword');

        assert.null(actualKey);
        assert.equal(actualPassword, 'abcd');
        assert.equal(actualCurrentPassword, 'efgh');
        assert.equal(actualProfileId, routeTester.authToken.profileId);
        assert.equal(routeTester.res.content.code, 0 );
    });    
})

*/