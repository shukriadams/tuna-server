const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/session/isvalid', async(testArgs)=>{
    
    it('route/session/isvalid : happy path : gets a user session', async () => {
        
        let actualAuthTokenId,
            actualProfileId,
            route = require(_$+'routes/session'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.query.token = 1234

        inject.object(_$+'logic/authToken', {
            getById : (authTokenId)=>{ 
                actualAuthTokenId = authTokenId
                return { id : authTokenId, profileId: 5678 } 
            }
        })

        inject.object(_$+'logic/profiles', {
            // song hash will also be checked
            songsHashValid : ()=>{ 
                return true
            },            
            getById : (profileId)=>{ 
                actualProfileId = profileId
                return { } // return a profile
            }
        })

        await routeTester.get('/v1/session/isvalid')

        assert.equal(actualAuthTokenId, 1234 )
        assert.equal(actualProfileId, 5678 )
        assert.true(routeTester.res.content.payload.isValid)
    })


    it('route/session/isvalid : unhappy path : token does not exist', async () => {
        
        let tokenLookup = false,
            profileLookup = false,
            route = require(_$+'routes/session'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.query.token = 1234
        
        inject.object(_$+'logic/authToken', {
            // this must return null to simulate in valid token
            getById : (authTokenId)=>{ 
                tokenLookup = true
                return null
            }
        })
        
        inject.object(_$+'logic/profiles', {
            getById : ()=>{ 
                profileLookup = true
                return null
            }
        })

        await routeTester.get('/v1/session/isvalid')

        assert.true(tokenLookup)
        assert.false(profileLookup)
        assert.false(routeTester.res.content.payload.isValid)
    })

    
    it('route/session/isvalid : unhappy path : user does not exist', async () => {
        
        let tokenLookup = false,
            profileLookup = false,
            route = require(_$+'routes/session'),
            routeTester = await new RouteTester(route)

        routeTester.authenticate()
        routeTester.req.query.token = 1234

        // this must return null to simulate in valid token
        inject.object(_$+'logic/authToken', {
            getById : (authTokenId)=>{ 
                tokenLookup = true
                return {}
            }
        })

        // must return null to simulate invalid profile
        inject.object(_$+'logic/profiles', {
            getById : ()=>{ 
                profileLookup = true
                return null
            }
        })

        await routeTester.get('/v1/session/isvalid')

        assert.true(tokenLookup)
        assert.true(profileLookup)
        assert.false(routeTester.res.content.payload.isValid)
    })

})

