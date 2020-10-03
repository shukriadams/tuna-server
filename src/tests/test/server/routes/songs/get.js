describe('route/song', async()=>{
    
    it('route/song::happy::gets a songs url', async ()=>{
        
        let actualSongId,
            actualProfileId,
            actualAuthTokenId,
            ctx = require(_$t+'testcontext'),
            route = require(_$+'routes/song'),
            RouteTester = require(_$t+'helpers/routeTester'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.params.id = 'blinded by fear'

        ctx.inject.object(_$+'logic/songs', {
            getSongUrl (songId, profileId, authTokenId){
                actualSongId = songId
                actualProfileId = profileId
                actualAuthTokenId = authTokenId
                return 'the-url'
            }
        }) 

        await routeTester.get('/v1/song/:id')

        ctx.assert.equal(actualSongId, 'blinded by fear')
        ctx.assert.equal(actualProfileId, routeTester.authToken.profileId )
        ctx.assert.equal(actualAuthTokenId, routeTester.authToken.id )
        ctx.assert.equal(routeTester.res.content.payload.url, 'the-url' )
    })


    it('route/song::unhappy::auth failure', async ()=>{
        const authedRouteTest = require(_$t+'helpers/authedRouteTester')
        authedRouteTest(_$+'routes/song','get', '/v1/song/:id')
    })

})
