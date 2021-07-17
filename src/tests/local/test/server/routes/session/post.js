describe('route/session/post', async(ctx)=>{
    
    it('route/session/post::happy::logs user in, returns user content', async () => {
        
        let ctx = require(_$t+'testcontext'),
            RouteTester = require(_$t+'helpers/routeTester'),
            settings = require(_$+'lib/settings'),
            actualUsername,
            actualPassword,
            route = require(_$+'routes/session'),
            routeTester = await new RouteTester(route)

        routeTester.req.body.password = 'mypass'
        routeTester.req.body.browserUID = 'myid'

        // disable brute force check
        ctx.inject.object(_$+'lib/bruteForce', {
            process (){ }, // do nothing
            clear (){ } // do nothing
        }) 
        
        ctx.inject.object(_$+'lib/content', {
            build (profileId, authTokenId){
                return { someUserContent : '............', profileId, authTokenId } 
            }
        })

        ctx.inject.object(_$+'logic/profiles', {
            authenticate (username, password){
                actualUsername = username
                actualPassword = password
                // this id will be passed along the chain of functions and eventually end up in the content returned
                return 'a-profile-id'
            }
        })

        ctx.inject.object(_$+'logic/authToken', {
            create (profileId){            
                return { id : 'myAuthtokenId'}
            }
        })

        await routeTester.post('/v1/session')

        ctx.assert.equal(actualUsername, settings.masterUsername)
        ctx.assert.equal(actualPassword, 'mypass')
        ctx.assert.null(routeTester.res.content.code)
        ctx.assert.equal(routeTester.res.content.payload.authToken, 'myAuthtokenId')
    })
    

    /**
     * Force an error to be sure that error handling code in route is covered
     */
    it('route/session/post::unhappy::forced error', async () => {
        const ctx = require(_$t+'testcontext')
        ctx.inject.object(_$+'lib/bruteForce', {
            process (){ 
                throw 'whatever'
            } 
        }) 

        const constants = require(_$+'types/constants'),
            route = require(_$+'routes/session'),
            RouteTester = require(_$t+'lib/routeTester'),
            routeTester = await new RouteTester(route)
            
        await routeTester.post('/v1/session')
        ctx.assert.equal(routeTester.res.content.code, constants.ERROR_DEFAULT)
    })
})
