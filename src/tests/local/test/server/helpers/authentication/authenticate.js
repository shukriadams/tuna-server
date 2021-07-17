describe('helpers/authentication/authenticate', ()=>{

    it('helpers/authentication/authenticate::happy::authenticates a request', async () => {
        const ctx = require(_$t+'testcontext')

        // completely bypass all logic in this, we just want the input back
        ctx.inject.object(_$+'lib/authentication', {
            authenticateTokenString (token){ 
                return token
            } 
        })

        const req = {
                header(){
                    return 'bearer my-token'
                }
            },
            authentication = require(_$+'lib/authentication'),
            token = await authentication.authenticate(req)

        ctx.assert.equal(token, 'my-token')
    })




    it('helpers/authentication/authenticate::unhappy::malformed header', async () => {
        const ctx = require(_$t+'testcontext')
        
        // completely bypass all logic in this, we just want the input back
        ctx.inject.object(_$+'lib/authentication', {
            authenticateTokenString (token){ 
                return token
            } 
        })

        const req = {
                header(){
                    return 'a badly formed header'
                }
            },
            authentication = require(_$+'lib/authentication'),
            token = await authentication.authenticate(req)

        ctx.assert.equal(token, 'a badly formed header')
    })

})

