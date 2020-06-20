const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/profiles/requestPassword', async(testArgs)=>{
    
    it('route/profiles/requestpassword : happy path : request a password reset', async () => {
        
        let route = require(_$+'routes/profile'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.query.email='abc@123'
        
        // disable brute force check
        inject.object(_$+'helpers/bruteForce', {
            process: ()=>{ }, // do nothing
            clear : ()=>{ } // do nothing
        }) 

        // read back actual values sent to playlist create
        let actualEmail
        inject.object(_$+'logic/profiles', {
            requestPasswordReset : (username, email)=>{
                actualEmail = email
            }
        })        

        await routeTester.get('/v1/profile/requestPassword')

        assert.equal(actualEmail, 'abc@123')
        assert.null(routeTester.res.content.code)
    })
    
})

