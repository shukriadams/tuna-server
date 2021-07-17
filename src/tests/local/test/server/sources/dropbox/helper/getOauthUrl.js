describe('sources/dropbox/helper/getOauthUrl', ()=>{
    
    it('sources/dropbox/helper/getOauthUrl::happy::gets url in normal mode', async () => {
        const ctx = require(_$t+'testcontext'),
            helper = require(_$+'sources/dropbox/helper'),
            url = await helper.getOauthUrl() 
        
        ctx.assert.includes(url, 'dropbox.com/oauth2/authorize?')
    })

    it('sources/dropbox/helper/getOauthUrl::happy::gets url in sandbox mode', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'lib/settings', {
            sandboxMode : true
        })

        const helper = require(_$+'sources/dropbox/helper'),
            url = await helper.getOauthUrl() 
        
        ctx.assert.includes(url, '/v1/sandbox/dropboxAuthenticate?')
    })
})