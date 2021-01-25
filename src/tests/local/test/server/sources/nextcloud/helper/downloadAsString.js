describe('sources/nextcloud/helper/downloadAsString', ()=>{
    
    it('sources/nextcloud/helper/downloadAsString::happy::downloads file', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object('madscience-httputils', {
            downloadString(){
                return {
                    body : 'my-string',
                    raw : { 
                        statusCode : 200,
                    }
                }
             }
        })

        const helper = require(_$+'sources/nextcloud/helper'),
            result = await helper.downloadAsString('my-token', 'my-profile',  'some-path') 

        ctx.assert.equal(result, 'my-string')
    })

})