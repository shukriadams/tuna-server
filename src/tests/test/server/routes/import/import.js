describe('route/songs/import', async()=>{
    
    it('route/import::happy::starts an import', async ()=>{
        
        let ctx = require(_$t+'testcontext'),
            route = require(_$+'routes/import'),
            RouteTester = require(_$t+'helpers/routeTester'),
            routeTester = await new RouteTester(route),
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
    

    it('route/playing::unhappy::auth failure', async ()=>{
        const authedRouteTest = require(_$t+'helpers/authedRouteTester')
        await authedRouteTest(_$+'routes/import','post', '/v1/import')
    })
})
