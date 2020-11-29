describe('sources/nextcloud/helper/getOauthUrl', ()=>{
    
    it('sources/nextcloud/helper/getOauthUrl::happy::gets sandbox url', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'helpers/settings', {
            sandboxMode : true
        })

        const helper = require(_$+'sources/nextcloud/helper')
        // call is enough, this test is for coverage
        await helper.getOauthUrl('my-token', 'some-path') 
    })

    
    it('sources/nextcloud/helper/getOauthUrl::happy::gets production url', async () => {
        const helper = require(_$+'sources/nextcloud/helper')

        // call is enough, this test is for coverage
        await helper.getOauthUrl('my-token', 'some-path') 
    })

})