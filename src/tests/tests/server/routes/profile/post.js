const 
    assert = require('madscience-node-assert'),
    RouteTester = require(_$t+'helpers/routeTester'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/profiles/post', async(testArgs)=>{
    
    it('route/profiles/post : happy path : updates a profile, returns user content', async () => {
        
        let 
            actualProfileData,
            route = require(_$+'routes/profile'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.body = { name : 1234 }

        // read back actual values sent to playlist create
        inject.object(_$+'logic/profiles', {
            updateProperties : (profileData) =>{
                actualProfileData = profileData
            }
        })

        // return some user content
        routeTester.setUserContent({ someUserContent : 'thorns of crimson death' })

        await routeTester.post('/v1/profile')

        assert.equal(actualProfileData.name, 1234 )
        // user id should always be forced in as profile id
        assert.equal(actualProfileData.id, routeTester.authToken.profileId )
        assert.equal(routeTester.res.content.payload.someUserContent, 'thorns of crimson death' )
    })
    
})
