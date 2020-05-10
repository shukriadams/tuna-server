const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/profile'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/profiles/post', async(testArgs)=>{
    
    it('route/profiles/post : happy path : updates a profile, returns user content', async () => {
        
        let routeTester = await new RouteTester(route);
        routeTester.authenticate();
        routeTester.req.body = { name : 1234 }
        // read back actual values sent to playlist create
        let actualProfileData;

        routeTester.route.profileLogic.updateProperties = (profileData)=>{
            actualProfileData = profileData;
        }

        // return some user content
        routeTester.route.profileLogic.buildUserContent = ()=>{ return { someUserContent : 'thorns of crimson death' } }

        await routeTester.post('/v1/profile');

        assert.equal(actualProfileData.name, 1234 );
        // user id should always be forced in as profile id
        assert.equal(actualProfileData.id, routeTester.authToken.profileId );
        assert.equal(routeTester.res.content.payload.someUserContent, 'thorns of crimson death' );
    });
    
});