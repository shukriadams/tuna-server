const 
    route = require(_$+'routes/profile'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/profiles/delete', async(ctx)=>{
    
    it('route/profiles/delete::happy    updates a profile, returns user content', async () => {
        
        let routeTester = await new RouteTester(route),
            actualProfileId,
            actualKey

        routeTester.authenticate()
        routeTester.req.query.key = 1234

        // read back actual values sent to playlist create

        ctx.inject.object(_$+'logic/profiles', {
            processDeleteAccount (profileId, key){
                actualProfileId = profileId
                actualKey = key
            }
        })

        await routeTester.get('/v1/profile/delete')

        ctx.assert.equal(actualKey, 1234)
        ctx.assert.equal(actualProfileId, routeTester.authToken.profileId )
        ctx.assert.null(routeTester.res.content.code) // aka empty response
    })
    
})
