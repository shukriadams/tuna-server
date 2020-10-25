describe('sources/dropbox/helper/downloadAsString', ()=>{
    
    it('sources/dropbox/helper/downloadAsString::happy::downloads file', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object('madscience-httputils', {
            post(){
                return {
                    body : 'my-string',
                    raw : { 
                        statusCode : 200,
                    }
                }
             }
        })

        const helper = require(_$+'sources/dropbox/helper'),
            result = await helper.downloadAsString('my-token', 'some-path') 

        ctx.assert.equal(result, 'my-string')
    })

    
    it('sources/dropbox/helper/downloadAsString::unhappy::file not found', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object('madscience-httputils', {
            post(){
                return {
                    body : JSON.stringify({
                        error_summary : 'blah path/not_found blah'
                    }),
                    raw : { 
                        statusCode : 500,
                    }
                }
             }
        })

        const constants = require(_$+'types/constants'),
            helper = require(_$+'sources/dropbox/helper'),
            exception = await ctx.assert.throws(async() =>  await helper.downloadAsString('my-token', 'some-path')  )    

        ctx.assert.equal(exception.code, constants.ERROR_NO_INDEX_FILE)
    })


    it('sources/dropbox/helper/downloadAsString::unhappy::unexpected dropbox error', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object('madscience-httputils', {
            post(){
                return {
                    body : JSON.stringify({ }),
                    raw : { 
                        statusCode : 500,
                    }
                }
             }
        })

        const constants = require(_$+'types/constants'),
            helper = require(_$+'sources/dropbox/helper'),
            exception = await ctx.assert.throws(async() =>  await helper.downloadAsString('my-token', 'some-path')  )    
            
        ctx.assert.equal(exception.code, constants.ERROR_DEFAULT)
    })


    it('sources/dropbox/helper/downloadAsString::unhappy::invalid body JSON', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object('madscience-httputils', {
            post(){
                return {
                    body : 'this-is-not-json',
                    raw : { 
                        statusCode : 500,
                    }
                }
             }
        })

        const helper = require(_$+'sources/dropbox/helper'),
            exception = await ctx.assert.throws(async() =>  await helper.downloadAsString('my-token', 'some-path')  )    
        
        ctx.assert.equal(JSON.stringify(exception.log.body), '"this-is-not-json"')
    })


    it('sources/dropbox/helper/downloadAsString::unhappy::http error', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object('madscience-httputils', {
            post(){
                throw 'post-error'
             }
        })

        const helper = require(_$+'sources/dropbox/helper'),
            exception = await ctx.assert.throws(async() =>  await helper.downloadAsString('my-token', 'some-path')  )    
        
        ctx.assert.equal(JSON.stringify(exception.inner), '"post-error"')
    })
})

