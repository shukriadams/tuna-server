const 
    constants = require(_$+'types/constants'),
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/oauth'),
    RouteTester = require(_$t+'helpers/routeTester'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/oauth/dropbox', async(testArgs)=>{
    
    it('route/oauth/dropbox : happy path : swap succeeds and redirects to next page', async () => {

        // capture actual used profile and code
        let actualProfileId,
            actualCode

        // override to return expect object
        inject.object(_$+'logic/authToken', {
            getById : ()=> { return { profileId : 'a-profile' }}
        })

        // override to capture input
        inject.object(_$+'helpers/dropbox/common', {
            swapCodeForToken : (profileId, code)=>{ 
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

        assert.equal(actualCode, 'some-code')
        assert.equal(actualProfileId, 'a-profile' )
        assert.equal(routeTester.res.redirected, '/the-page')
    })


    it('route/oauth/dropbox : unhappy path : throws auth error authtoken invalid', async () => {
        
        // ensure authtoken is null
        inject.object(_$+'logic/authToken', {
            getById : ()=> null
        })

        let routeTester = await new RouteTester(route)

        await routeTester.get('/v1/oauth/dropbox')

        assert.equal(routeTester.res.content.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })

})

