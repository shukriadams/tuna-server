const 
    assert = require('madscience-node-assert'),
    RouteTester = require(_$t+'helpers/routeTester'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/profiles/resetpassword', async(testArgs)=>{
    
    it('route/profiles/resetpassword : happy path : request a password reset if not logged in', async () => {
        
        let actualPassword,
            actualKey,
            actualProfileId,
            actualCurrentPassword,
            route = require(_$+'routes/profile'),
            routeTester = await new RouteTester(route)

        // send only a key, this is all we need when reseting password
        routeTester.req.query.key='abcd'
        
        // disable brute force check
        inject.object(_$+'helpers/bruteForce', {
            process: ()=>{ }, // do nothing
            clear : ()=>{ } // do nothing
        }) 

        // read back actual values sent to playlist create
        inject.object(_$+'logic/profiles', {
            resetPassword : (key, password, currentPassword, profileId)=>{
                actualPassword = password
                actualKey = key
                actualProfileId = profileId
                actualCurrentPassword = currentPassword
            }
        })  

        await routeTester.get('/v1/profile/resetPassword')

        assert.equal(actualKey, 'abcd')
        assert.null(actualPassword)
        assert.null(actualProfileId)
        assert.null(actualCurrentPassword)
        assert.null(routeTester.res.content.code)
    })


    it('route/profiles/resetpassword : happy path : request a password reset if logged in', async () => {
        
        let route = require(_$+'routes/profile'),
            routeTester = await new RouteTester(route),
            actualPassword,
            actualKey,
            actualProfileId,
            actualCurrentPassword

        // disable brute force check
        inject.object(_$+'helpers/bruteForce', {
            process: ()=>{ }, // do nothing
            clear : ()=>{ } // do nothing
        }) 

        // read back actual values sent to playlist create
        inject.object(_$+'logic/profiles', {
            resetPassword : (key, password, currentPassword, profileId)=>{
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

        assert.null(actualKey)
        assert.equal(actualPassword, 'abcd')
        assert.equal(actualCurrentPassword, 'efgh')
        assert.equal(actualProfileId, routeTester.authToken.profileId)
        assert.null(routeTester.res.content.code)
    })
})
