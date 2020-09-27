const 
    route = require(_$+'routes/import'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/songs/import', async(ctx)=>{
    
    it('route/import::happy    starts an import', async ()=>{
        
        let routeTester = await new RouteTester(route),
            actualProfileId,
            actualAuthTokenId

        routeTester.authenticate()

        // need to return a fake importer
        ctx.inject.object(_$+'helpers/sourceProvider', {
            getImporter (){
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

        await routeTester.post('/v1/import')

        ctx.assert.equal(actualAuthTokenId, routeTester.authToken.id )
        ctx.assert.equal(actualProfileId, routeTester.authToken.profileId )
        ctx.assert.equal(routeTester.res.content.payload.someUserContent, 'the somberlain' )
    })
    
})
