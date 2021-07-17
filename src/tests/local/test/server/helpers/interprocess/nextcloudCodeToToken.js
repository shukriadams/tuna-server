describe('helpers/interprocess/nextcloudCodeToToken', function(){

    it('helpers/interprocess/nextcloudCodeToToken::happy::gets token from nextcloud code', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'logic/profiles', {
            getByIdentifier (){ 
                return {}
            } 
        })

        ctx.inject.object(_$+'sources/nextcloud/helper', {
            swapCodeForToken (){ 
                return {}
            } 
        })
        
        const interprocess = require(_$+'lib/interprocess'),
            result = await interprocess.nextcloudCodeToToken({})

        ctx.assert.includes(result, 'SUCCESS')
    })


    
    it('helpers/interprocess/nextcloudCodeToToken::unhappy::sandbox prevents code swap', async () => {
        let ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'lib/settings', {
            sandboxMode : true
        })

        const interprocess = require(_$+'lib/interprocess'),
            result = await interprocess.nextcloudCodeToToken({})

        ctx.assert.includes(result, 'FAILED')
    })
    
})

