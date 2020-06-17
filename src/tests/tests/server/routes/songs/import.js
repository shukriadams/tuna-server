const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/songs'),
    inject = require(_$t+'helpers/inject'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/songs/import', async(testArgs)=>{
    
    it('route/songs/import : happy path : starts an import', async ()=>{
        
        let routeTester = await new RouteTester(route),
            actualProfileId,
            actualAuthTokenId

        routeTester.authenticate()

        // need to return a fake importer
        inject.object(_$+'helpers/sourceProvider', {
            getImporter: ()=>{
                return class {
                    constructor(profile, authTokenId){
                        actualProfileId = profile
                        actualAuthTokenId = authTokenId
                    }
                    start(){ } // do nothing
                }
            }
        }) 

        routeTester.setUserContent({ someUserContent : 'the somberlain' })

        await routeTester.post('/v1/songs/import')

        assert.equal(actualAuthTokenId, routeTester.authToken.id )
        assert.equal(actualProfileId, routeTester.authToken.profileId )
        assert.equal(routeTester.res.content.payload.someUserContent, 'the somberlain' )
    })
    
})
