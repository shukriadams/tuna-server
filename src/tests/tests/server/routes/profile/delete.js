const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/profile'),
    RouteTester = require(_$t+'helpers/routeTester'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/profiles/delete', async(testArgs)=>{
    
    it('route/profiles/delete : happy path : updates a profile, returns user content', async () => {
        
        let routeTester = await new RouteTester(route),
            actualProfileId,
            actualKey

        routeTester.authenticate()
        routeTester.req.query.key = 1234

        // read back actual values sent to playlist create

        inject.object(_$+'logic/profiles', {
            processDeleteAccount : (profileId, key) =>{
                actualProfileId = profileId
                actualKey = key
            }
        })

        await routeTester.get('/v1/profile/delete')

        assert.equal(actualKey, 1234)
        assert.equal(actualProfileId, routeTester.authToken.profileId )
        assert.null(routeTester.res.content.code) // aka empty response
    })
    
})
