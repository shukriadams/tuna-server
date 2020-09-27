const mocha = require(_$t+'helpers/testbase')

mocha('helpers/bruteforce/clear', function(ctx){

    it('helpers/bruteforce/clear::happy    clears log', async () => {

        let removed = false
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

