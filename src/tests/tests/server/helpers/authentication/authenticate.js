const mocha = require(_$t+'helpers/testbase')

mocha('helpers/authentication/authenticate', function(ctx){

    it('helpers/authentication/authenticate::happy    authenticates a request', async () => {
        // completely bypass all logic in this, we just want the input back
        ctx.inject.object(_$+'helpers/authentication', {
            authenticateTokenString (token){ 
                return token
            } 
        })

        const req = {
                header(){
                    return 'bearer my-token'
                }
            },
            authentication = require(_$+'helpers/authentication'),
            token = await authentication.authenticate(req)

        ctx.assert.equal(token, 'my-token')
    })




    it('helpers/authentication/authenticate::unhappy    malformed header', async () => {
        // completely bypass all logic in this, we just want the input back
        ctx.inject.object(_$+'helpers/authentication', {
            authenticateTokenString (token){ 
                return token
            } 
        })

        const req = {
                header(){
                    return 'a badly formed header'
                }
            },
            authentication = require(_$+'helpers/authentication'),
            token = await authentication.authenticate(req)

        ctx.assert.equal(token, 'a badly formed header')
    })

})

