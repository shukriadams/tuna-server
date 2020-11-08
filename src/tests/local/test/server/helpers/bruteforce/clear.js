describe('helpers/bruteforce/clear', function(){

    it('helpers/bruteforce/clear::happy::clears log', async () => {

        let removed = false,
            ctx = require(_$t+'testcontext')
            
        ctx.inject.object(_$+'helpers/cache', {
            remove (key){ 
                removed = true
            } 
        })

        const bruteforce = require(_$+'helpers/bruteForce'),
            options = {
                request : {
                    connection : {
                        remoteAddress : 'my-ip'
                    }
                }
            }

        await bruteforce.clear(options)

        ctx.assert.true(removed)
    })

})

