const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/session'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/session/isvalid', async(testArgs)=>{
    
    it('route/session/isvalid : happy path : gets a user session', async () => {
        
        let routeTester = await new RouteTester(route);
        routeTester.authenticate();
        routeTester.req.query.token = 1234;

        let actualAuthTokenId,
            actualProfileId;

        routeTester.route.authTokenLogic.getById =(authTokenId)=>{ 
            actualAuthTokenId = authTokenId;
            return { id : authTokenId, profileId: 5678 } 
        }

        routeTester.route.profileLogic.getById =(profileId)=>{ 
            actualProfileId = profileId;
            return { } // return a profile
        }


        await routeTester.get('/v1/session/isvalid');

        assert.equal(actualAuthTokenId, 1234 );
        assert.equal(actualProfileId, 5678 );
        assert.equal(routeTester.res.content.payload.isValid, true );

    });

    it('route/session/isvalid : unhappy path : token does not exist', async () => {
        
        let routeTester = await new RouteTester(route);
        routeTester.authenticate();
        routeTester.req.query.token = 1234;
        
        let tokenLookup = false;
            profileLookup = false;

        // this must return null to simulate in valid token
        routeTester.route.authTokenLogic.getById =()=>{ 
            tokenLookup = true;
            return null;
        }
        
        routeTester.route.profileLogic.getById =()=>{ 
            profileLookup = true;
            return null
        }

        await routeTester.get('/v1/session/isvalid');

        assert.true(tokenLookup);
        assert.false(profileLookup);
        assert.equal(routeTester.res.content.payload.isValid, false );

    });
    
    it('route/session/isvalid : unhappy path : user does not exist', async () => {
        
        let routeTester = await new RouteTester(route);
        routeTester.authenticate();
        routeTester.req.query.token = 1234;

        let tokenLookup = false;
            profileLookup = false;

        routeTester.route.authTokenLogic.getById =()=>{ 
            tokenLookup = true;
            return {};
        }

        // must return null to simulate invalid profile
        routeTester.route.profileLogic.getById =()=>{ 
            profileLookup = true;
            return null
        }

        await routeTester.get('/v1/session/isvalid');

        assert.true(tokenLookup);
        assert.true(profileLookup);
        assert.equal(routeTester.res.content.payload.isValid, false );

    });
});