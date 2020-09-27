const 
    constants = require(_$+'types/constants'),
    route = require(_$+'routes/oauth'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/oauth/nextcloud', async(ctx)=>{
    
    it('route/oauth/nextcloud::happy    swap succeeds and redirects to next page ', async () => {
        
        let actualProfileId,
            actualCode

        // capture actual used profile and code
        ctx.inject.object(_$+'helpers/nextcloud/common', {
            swapCodeForToken (profileId, code){ 
                actualProfileId = profileId
                actualCode = code
            }
        })
 
        ctx.inject.object(_$+'logic/authToken', {
            getById (){ 
                return { profileId: 'a-profile' 
            }}
        })

        let routeTester = await new RouteTester(route)
        // code to be converted to token
        routeTester.req.query.code = 'some-code'
        // combination of user's authtoken + page to redirect to
        routeTester.req.query.state = 'the-auth-token_the-page'


        await routeTester.get('/v1/oauth/nextcloud')

        ctx.assert.equal(actualCode, 'some-code')
        ctx.assert.equal(actualProfileId, 'a-profile')
        ctx.assert.equal(routeTester.res.redirected, '/the-page')
    })




    it('route/oauth/nextcloud::unhappy    throws auth error authtoken invalid', async () => {
        ctx.inject.object(_$+'logic/authToken', {
            // ensure authtoken is null
            getById (){ 
                return null 
            }

        })        

        const routeTester = await new RouteTester(route)
        await routeTester.get('/v1/oauth/nextcloud')
        ctx.assert.equal(routeTester.res.content.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })

})
