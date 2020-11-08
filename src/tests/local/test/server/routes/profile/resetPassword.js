describe('route/profiles/resetPassword', async(ctx)=>{
    
    it('route/profiles/resetpassword::happy::request a password reset if not logged in', async () => {
        
        let ctx = require(_$t+'testcontext'),
            RouteTester = require(_$t+'helpers/routeTester'),
            actualPassword,
            actualKey,
            actualProfileId,
            actualCurrentPassword,
            route = require(_$+'routes/profile'),
            routeTester = await new RouteTester(route)

        // send only a key, this is all we need when reseting password
        routeTester.req.query.key = 'abcd'
        
        // disable brute force check
        ctx.inject.object(_$+'helpers/bruteForce', {
            process (){ }, // do nothing
            clear (){ } // do nothing
        }) 

        // read back actual values sent to playlist create
        ctx.inject.object(_$+'logic/profiles', {
            resetPassword (key, password, currentPassword, profileId){
                actualPassword = password
                actualKey = key
                actualProfileId = profileId
                actualCurrentPassword = currentPassword
            }
        })  

        await routeTester.get('/v1/profile/resetPassword')

        ctx.assert.equal(actualKey, 'abcd')
        ctx.assert.null(actualPassword)
        ctx.assert.null(actualProfileId)
        ctx.assert.null(actualCurrentPassword)
        ctx.assert.null(routeTester.res.content.code)
    })




    it('route/profiles/resetpassword::happy::request a password reset if logged in', async () => {
        
        let ctx = require(_$t+'testcontext'),
            RouteTester = require(_$t+'helpers/routeTester'),
            route = require(_$+'routes/profile'),
            routeTester = await new RouteTester(route),
            actualPassword,
            actualKey,
            actualProfileId,
            actualCurrentPassword

        // disable brute force check
        ctx.inject.object(_$+'helpers/bruteForce', {
            process (){ }, // do nothing
            clear (){ } // do nothing
        }) 

        // read back actual values sent to playlist create
        ctx.inject.object(_$+'logic/profiles', {
            resetPassword (key, password, currentPassword, profileId){
                actualPassword = password
                actualKey = key
                actualProfileId = profileId
                actualCurrentPassword = currentPassword
            }
        }) 

        // need to be authenticated, and send current password and new password
        routeTester.authenticate()
        routeTester.req.query.password='abcd'
        routeTester.req.query.currentPassword='efgh'
        await routeTester.get('/v1/profile/resetPassword')

        ctx.assert.null(actualKey)
        ctx.assert.equal(actualPassword, 'abcd')
        ctx.assert.equal(actualCurrentPassword, 'efgh')
        ctx.assert.equal(actualProfileId, routeTester.authToken.profileId)
        ctx.assert.null(routeTester.res.content.code)
    })

    it('route/playing::unhappy::auth failure', async ()=>{
        const authedRouteTest = require(_$t+'helpers/authedRouteTester')
        await authedRouteTest(_$+'routes/profile','get', '/v1/profile/resetPassword')
    })
})
