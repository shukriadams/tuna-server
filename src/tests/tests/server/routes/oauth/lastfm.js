const 
    constants = require(_$+'types/constants'),
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/oauth'),
    RouteTester = require(_$t+'helpers/routeTester'),
    requireMock = require(_$t+'helpers/require'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/oauth/lastfm', async(testArgs)=>{
    
    it('route/oauth/lastfm : happy path : swap succeeds and redirects to next page', async () => {
        
        const authTokenLogic = require(_$+'logic/authToken')
        authTokenLogic.getById =()=>{ return { profileId: 'a-profile' }}
        requireMock.add(_$+'logic/authToken', authTokenLogic)


        let lastFmHelper = require(_$+'helpers/lastfm'),
            actualProfileId,
            actualCode

        lastFmHelper.swapCodeForToken = (profileId, code)=>{ 
            actualProfileId = profileId
            actualCode = code
        }
        requireMock.add(_$+'helpers/lastfm', lastFmHelper)



        let routeTester = await new RouteTester(route)
        // code to be converted to token
        routeTester.req.query.token = 'lastfm-token'
        // authtokenis is passed in in state
        routeTester.req.query.state = 'the-auth-token'

        // capture actual used profile and code


        await routeTester.get('/v1/oauth/lastfm')

        assert.equal(actualCode, 'lastfm-token')
        assert.equal(actualProfileId, 'a-profile')
        assert.equal(routeTester.res.redirected, '/reload')
    })


    it('route/oauth/lastfm : unhappy path : throws auth error authtoken invalid', async () => {

        const authTokenLogic = require(_$+'logic/authToken')
        authTokenLogic.getById =()=>{ return null }
        requireMock.add(_$+'logic/authToken', authTokenLogic)

        
        let routeTester = await new RouteTester(route)
        await routeTester.get('/v1/oauth/lastfm')
        assert.equal(routeTester.res.content.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })

})
