describe('route/profiles/post', async()=>{
    
    it('route/profiles/post::happy::updates a profile, returns user content', async () => {
        
        let ctx = require(_$t+'testcontext'), 
            RouteTester = require(_$t+'helpers/routeTester'),
            actualProfileData,
            route = require(_$+'routes/profile'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.body = { name : 1234 }

        // read back actual values sent to playlist create
        ctx.inject.object(_$+'logic/profiles', {
            updateProperties (profileData) {
                actualProfileData = profileData
            }
        })

        // return some user content
        routeTester.setUserContent({ someUserContent : 'thorns of crimson death' })

        await routeTester.post('/v1/profile')

        ctx.assert.equal(actualProfileData.name, 1234 )
        // user id should always be forced in as profile id
        ctx.assert.equal(actualProfileData.id, routeTester.authToken.profileId )
        ctx.assert.equal(routeTester.res.content.payload.someUserContent, 'thorns of crimson death' )
    })
    
})
