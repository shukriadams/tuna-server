describe('helpers/authentication/authenticateToken', function(){

    it('helpers/authentication/authenticateToken::happy::authenticates a token string', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'logic/authToken', {
            getById (){ 
                return { foo : 'bar'}
            } 
        })

        const authentication = require(_$+'helpers/authentication'),
             token = await authentication.authenticateTokenString('my-token')

        ctx.assert.equal(token.foo, 'bar')
    })

    


    it('helpers/authentication/authenticateToken::unhappy::no token string', async () => {
        const ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants'),
            authentication = require(_$+'helpers/authentication'),
            exception = await ctx.assert.throws(async () => await authentication.authenticateTokenString(/* no string here */) )

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })

    


    it('helpers/authentication/authenticateToken::unhappy::invalid auth token', async () => {
        const ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants')

        // return null to trigger invalid auth token exception
        ctx.inject.object(_$+'logic/authToken', {
            getById (){ 
                return null
            } 
        })

        const authentication = require(_$+'helpers/authentication'),
             exception = await ctx.assert.throws(async () => await authentication.authenticateTokenString('my-token'))

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })
})

