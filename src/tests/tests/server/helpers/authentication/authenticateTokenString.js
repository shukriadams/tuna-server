const constants = require(_$+'types/constants'),
    mocha = require(_$t+'helpers/testbase')

mocha('helpers/authentication/authenticateToken', function(ctx){

    it('helpers/authentication/authenticateToken::happy    authenticates a token string', async () => {
        
        ctx.inject.object(_$+'logic/authToken', {
            getById (){ 
                return { foo : 'bar'}
            } 
        })

        const authentication = require(_$+'helpers/authentication'),
             token = await authentication.authenticateTokenString('my-token')

        ctx.assert.equal(token.foo, 'bar')
    })

    


    it('helpers/authentication/authenticateToken::unhappy    no token string', async () => {
        const authentication = require(_$+'helpers/authentication'),
            exception = await ctx.assert.throws(async () => await authentication.authenticateTokenString(/* no string here */) )

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })

    


    it('helpers/authentication/authenticateToken::unhappy    invalid auth token', async () => {
        // return null to trigger invalid auth token exception
        ctx.inject.object(_$+'logic/authToken', {
            getById (){ 
                return null
            } 
        })

        const authentication = require(_$+'helpers/authentication'),
             exception = await ctx.assert.throws(async () => await authentication.authenticateTokenString(/* no string here */) )

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })
})

