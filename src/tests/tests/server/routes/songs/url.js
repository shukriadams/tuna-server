const 
    route = require(_$+'routes/songs'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/songs/url', async(ctx)=>{
    
    it('route/songs/url::happy    gets a songs url', async ()=>{
        
        let actualSongId,
            actualProfileId,
            actualAuthTokenId,
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.query.song = 'blinded by fear'

        ctx.inject.object(_$+'logic/songs', {
            getSongUrl (songId, profileId, authTokenId){
                actualSongId = songId
                actualProfileId = profileId
                actualAuthTokenId = authTokenId
                return 'the-url'
            }
        }) 

        await routeTester.get('/v1/songs/url')

        ctx.assert.equal(actualSongId, 'blinded by fear')
        ctx.assert.equal(actualProfileId, routeTester.authToken.profileId )
        ctx.assert.equal(actualAuthTokenId, routeTester.authToken.id )
        ctx.assert.equal(routeTester.res.content.payload.url, 'the-url' )
    })
    
})
