const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/songs'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/songs/import', async(testArgs)=>{
    
    it('route/songs/import : happy path : starts an import', async ()=>{
        
        let routeTester = await new RouteTester(route);
        routeTester.authenticate();

        let actualProfileId,
            actualAuthTokenId;

        // need to return a fake importer
        routeTester.route.sourceProvider.getImporter=()=>{
            return class {
                constructor(profile, authTokenId){
                    actualProfileId = profile;
                    actualAuthTokenId = authTokenId;
                }
                start(){ /* do nothing*/ }
            }
        }

        routeTester.route.profileLogic.buildUserContent = ()=>{ return { someUserContent : 'the somberlain' } }


        await routeTester.post('/v1/songs/import');

        assert.equal(actualAuthTokenId, routeTester.authToken.id );
        assert.equal(actualProfileId, routeTester.authToken.profileId );
        assert.equal(routeTester.res.content.payload.someUserContent, 'the somberlain' );
    });
    
});