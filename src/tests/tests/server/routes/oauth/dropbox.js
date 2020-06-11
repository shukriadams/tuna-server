const 
    constants = require(_$+'types/constants'),
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/oauth'),
    RouteTester = require(_$t+'helpers/routeTester'),
    requireMock = require(_$t+'helpers/require'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/oauth/dropbox', async(testArgs)=>{
    
    it('route/oauth/dropbox : happy path : swap succeeds and redirects to next page', async () => {
        
        const authTokenLogic = require(_$+'logic/authToken')
        authTokenLogic.getById =()=>{ return { profileId: 'a-profile' }}
        requireMock.add(_$+'logic/authToken', authTokenLogic)

        const dropboxHelper = require(_$+'helpers/dropbox/common')
        dropboxHelper.swapCodeForToken =(profileId, code)=>{ 
            actualProfileId = profileId
            actualCode = code
        }
        requireMock.add(_$+'helpers/dropbox/common', dropboxHelper)

        
        let routeTester = await new RouteTester(route)
        // code to be converted to token
        routeTester.req.query.code = 'some-code'
        // combination of user's authtoken + page to redirect to
        routeTester.req.query.state = 'the-auth-token_the-page'


        // capture actual used profile and code
        let actualProfileId,
            actualCode



        await routeTester.get('/v1/oauth/dropbox')

        assert.equal(actualCode, 'some-code')
        assert.equal(actualProfileId, 'a-profile' )
        assert.equal(routeTester.res.redirected, '/the-page')
    })


    it('route/oauth/dropbox : unhappy path : throws auth error authtoken invalid', async () => {
        
        // ensure authtoken is null
        const authTokenLogic = require(_$+'logic/authToken')
        authTokenLogic.getById =()=>{ return null }
        requireMock.add(_$+'logic/authToken', authTokenLogic)

        let routeTester = await new RouteTester(route)

        await routeTester.get('/v1/oauth/dropbox')

        assert.equal(routeTester.res.content.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })

})

