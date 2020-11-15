describe('helpers/interprocess/intialize', function(){

    it('helpers/interprocess/intialize::happy::intializes', async () => {
        let ctx = require(_$t+'testcontext')
        
        // need to hide ipc or real ipc will start serving and test thread will not exit
        ctx.inject.object('node-ipc', {
            server : {
                start(){

                }
            },
            serve(){

            } 
        })
        
        const interprocess = require(_$+'helpers/interprocess')
        await interprocess.initialize()
        interprocess.ipc.serve()

        ctx.assert.notNull(interprocess.ipc)
    })
})

