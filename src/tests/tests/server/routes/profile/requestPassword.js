/*

const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/profile'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/profiles/requestpassword', async(testArgs)=>{
    
    it('route/profiles/requestpassword : happy path : request a password reset', async () => {
        
        let routeTester = await new RouteTester(route);
        routeTester.authenticate();
        routeTester.req.query.email='abc@123';
        
        // disable brute force check
        routeTester.route.bruteForce.process=()=>{ } // do nothing
        routeTester.route.bruteForce.clear=()=>{ } // do nothing

        // read back actual values sent to playlist create
        let actualEmail;
        routeTester.route.profileLogic.requestPasswordReset = (username, email)=>{
            actualEmail = email;
        }

        await routeTester.get('/v1/profile/requestPassword');

        assert.equal(actualEmail, 'abc@123');
        assert.equal(routeTester.res.content.code, 0 );
    });
    
})

*/