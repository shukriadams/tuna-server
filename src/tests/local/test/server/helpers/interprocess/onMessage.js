describe('helpers/interprocess/conMessage', function(){

    it('helpers/interprocess/conMessage::happy::handles password change message', async () => {
        let ctx = require(_$t+'testcontext'),
            emitted = false,
            called = false

        ctx.inject.object(_$+'helpers/interprocess', {
            changePassword(){
                called = true
            },            
            ipc : {
                server : {
                    emit(){
                        emitted = true
                    }
                }
            }
        })

        const interprocess = require(_$+'helpers/interprocess')
        await interprocess.onMessage({ name : 'password-change' })

        ctx.assert.true(emitted)
        ctx.assert.true(called)
    })
 
    it('helpers/interprocess/conMessage::happy::handles codeToToken message', async () => {
        let ctx = require(_$t+'testcontext'),
            called = false,
            emitted = false

        ctx.inject.object(_$+'helpers/interprocess', {
            nextcloudCodeToToken(){
                called = true
            },
            ipc : {
                server : {
                    emit(){
                        emitted = true
                    }
                }
            }
        })

        const interprocess = require(_$+'helpers/interprocess')
        await interprocess.onMessage({ name : 'nextcloud-codeToToken' })

        ctx.assert.true(emitted)
        ctx.assert.true(called)
    })
})

