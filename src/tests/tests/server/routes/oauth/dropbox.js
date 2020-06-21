const 
    constants = require(_$+'types/constants'),
    route = require(_$+'routes/oauth'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/oauth/dropbox', async(ctx)=>{
    
    it('route/oauth/dropbox::happy    swap succeeds and redirects to next page', async () => {

        // capture actual used profile and code
        let actualProfileId,
            actualCode

        // override to return expect object
        ctx.inject.object(_$+'logic/authToken', {
            getById (){ 
                return { profileId : 'a-profile' 
            }}
        })

        // override to capture input
        ctx.inject.object(_$+'helpers/dropbox/common', {
            swapCodeForToken (profileId, code){ 
                actualProfileId = profileId
                actualCode = code
            }
        })
        
        let routeTester = await new RouteTester(route)
        // code to be converted to token
        routeTester.req.query.code = 'some-code'
        // combination of user's authtoken + page to redirect to
        routeTester.req.query.state = 'the-auth-token_the-page'

        await routeTester.get('/v1/oauth/dropbox')

        ctx.assert.equal(actualCode, 'some-code')
        ctx.assert.equal(actualProfileId, 'a-profile' )
        ctx.assert.equal(routeTester.res.redirected, '/the-page')
    })




    it('route/oauth/dropbox::unhappy    throws auth error authtoken invalid', async () => {
        
        // ensure authtoken is null
        ctx.inject.object(_$+'logic/authToken', {
            getById : ()=> null
        })

        const routeTester = await new RouteTester(route)

        await routeTester.get('/v1/oauth/dropbox')

        ctx.assert.equal(routeTester.res.content.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })

})

