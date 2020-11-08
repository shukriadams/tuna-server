describe('helpers/interprocess/changePassword', function(){

    it('helpers/interprocess/changePassword::happy::changes password', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'logic/profiles', {
            getByIdentifier (){ 
                return {}
            },
            update(){

            } 
        })
        
        const interprocess = require(_$+'helpers/interprocess'),
            result = await interprocess.changePassword({})

        ctx.assert.includes(result, 'Password updated')
    })
})

