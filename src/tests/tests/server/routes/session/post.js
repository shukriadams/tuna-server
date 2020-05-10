const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/session'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/session/post', async(testArgs)=>{
    
    it('route/session/post : happy path : logs user in, returns user content', async () => {
        
        let routeTester = await new RouteTester(route);
        routeTester.req.body.password = 'mypass';
        routeTester.req.body.browserUID = 'myid';

        // disable brute forcing
        routeTester.route.bruteForce.process=()=>{ /*do nothing*/}
        routeTester.route.bruteForce.clear=()=>{ /*do nothing*/}

        let actualUsername,
            actualPassword;

        routeTester.route.profileLogic.authenticate = (username, password)=>{
            actualUsername = username;
            actualPassword = password;
            // this id will be passed along the chain of functions and eventually end up in the content returned
            return 'a-profile-id';
        }

        routeTester.route.authTokenLogic.create = (profileId)=>{            
            return { profileId, id : 'myAuthtokenId'}
        }

        routeTester.route.songsLogic.getAll =()=> {
            return['a song']
        }

        routeTester.route.profileLogic.buildUserContent =(profileId, authTokenId)=>{
            return { someUserContent : '............', profileId, authTokenId } 
        }

        await routeTester.post('/v1/session');

        assert.equal(actualUsername, settings.masterUsername);
        assert.equal(actualPassword, 'mypass');
        assert.equal(routeTester.res.content.code, 0 );
        assert.equal(routeTester.res.content.payload.profileId, 'a-profile-id' );
        assert.equal(routeTester.res.content.payload.songs[0], 'a song' );        
    });
    
});