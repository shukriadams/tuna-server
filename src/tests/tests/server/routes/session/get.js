const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/session'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/session/get', async(testArgs)=>{
    
    it('route/session/get : happy path : gets a user session', async () => {
        
        let routeTester = await new RouteTester(route);
        routeTester.authenticate();
        
        let actualProfileId,
            actualAuthTokenId;
        
        routeTester.route.profileLogic.buildUserContent =(profileId, authTokenId)=>{ 
            actualProfileId = profileId;
            actualAuthTokenId = authTokenId;
            return { someUserContent : 'plague ship' } 
        }

        await routeTester.get('/v1/session');

        assert.equal(actualProfileId, routeTester.authToken.profileId );
        assert.equal(actualAuthTokenId, routeTester.authToken.id );
        assert.equal(routeTester.res.content.payload.someUserContent, 'plague ship' );
    });
    
});