const 
    constants = require(_$+'types/constants'),
    route = require(_$+'routes/oauth'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/oauth/lastfm', async(ctx)=>{
    
    it('route/oauth/lastfm::happy    swap succeeds and redirects to next page', async () => {
        let actualProfileId,
            actualCode
        
        ctx.inject.object(_$+'logic/authToken', {
            getById(){ 
                return { profileId: 'a-profile' 
            }}
        })

        // capture actual used profile and code
        ctx.inject.object(_$+'helpers/lastfm', {
            swapCodeForToken(profileId, code){ 
                actualProfileId = profileId
                actualCode = code
            }
        })

        let routeTester = await new RouteTester(route)
        // code to be converted to token
        routeTester.req.query.token = 'lastfm-token'
        // authtokenis is passed in in state
        routeTester.req.query.state = 'the-auth-token'

        await routeTester.get('/v1/oauth/lastfm')

        ctx.assert.equal(actualCode, 'lastfm-token')
        ctx.assert.equal(actualProfileId, 'a-profile')
        ctx.assert.equal(routeTester.res.redirected, '/reload')
    })




    it('route/oauth/lastfm::unhappy    throws auth error authtoken invalid', async () => {
        ctx.inject.object(_$+'logic/authToken', {
            getById(){ 
                return null 
            }
        })

        const routeTester = await new RouteTester(route)
        await routeTester.get('/v1/oauth/lastfm')
        ctx.assert.equal(routeTester.res.content.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })

})
