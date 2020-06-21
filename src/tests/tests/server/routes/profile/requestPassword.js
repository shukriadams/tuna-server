const 
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/profiles/requestPassword', async(ctx)=>{
    
    it('route/profiles/requestpassword::happy    request a password reset', async () => {
        
        let route = require(_$+'routes/profile'),
            actualEmail,
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.query.email='abc@123'
        
        // disable brute force check
        ctx.inject.object(_$+'helpers/bruteForce', {
            process(){ }, // do nothing
            clear(){ } // do nothing
        }) 

        // read back actual values sent to playlist create
        ctx.inject.object(_$+'logic/profiles', {
            requestPasswordReset (username, email){
                actualEmail = email
            }
        })        

        await routeTester.get('/v1/profile/requestPassword')

        ctx.assert.equal(actualEmail, 'abc@123')
        ctx.assert.null(routeTester.res.content.code)
    })
    
})

