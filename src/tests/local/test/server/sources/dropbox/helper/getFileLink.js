describe('sources/dropbox/helper/getFileLink', ()=>{
    
    it('sources/dropbox/helper/getFileLink::happy::gets file link', async () => {
        const ctx = require(_$t+'testcontext'),
            helper = require(_$+'sources/dropbox/helper'),
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'lib/settings', {
            sandboxMode : true
        })

        ctx.inject.object('madscience-httputils', {
            post(){
                // success result
                return {
                    raw : {
                        statusCode : 200
                    },
                    body : JSON.stringify({
                        link : 'the-link'
                    })
                }
            }
        })

        const sources = {}
        sources[constants.SOURCES_DROPBOX] = {
            accessToken : 'some-token'
        }

        const link = await helper.getFileLink(sources, 'my-profile', 'some-path') 
        ctx.assert.equal(link, 'the-link')
    })


    it('sources/dropbox/helper/getFileLink::unhappy::no source', async () => {
        const ctx = require(_$t+'testcontext'),
            helper = require(_$+'sources/dropbox/helper'),
            constants = require(_$+'types/constants')
            exception = await ctx.assert.throws(async() => await helper.getFileLink({}) )    

        ctx.assert.equal(exception.inner.code, constants.ERROR_INVALID_SOURCE_INTEGRATION)
    })


    it('sources/dropbox/helper/getFileLink::unhappy::no access token', async () => {
        const ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants'),
            helper = require(_$+'sources/dropbox/helper')

        // define source but omit access token
        const sources = {}
        sources[constants.SOURCES_DROPBOX] = {}            

        const exception = await ctx.assert.throws(async() => await helper.getFileLink(sources, 'my-profile', 'my-path') )    
        ctx.assert.equal(exception.inner.code, constants.ERROR_INVALID_SOURCE_INTEGRATION)
    })


    it('sources/dropbox/helper/getFileLink::unhappy::error response', async () => {
        const ctx = require(_$t+'testcontext'),
            helper = require(_$+'sources/dropbox/helper'),
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'lib/settings', {
            sandboxMode : true
        })

        ctx.inject.object('madscience-httputils', {
            post(){
                // fail result
                return {
                    raw : {
                        statusCode : 500
                    }
                }
            }
        })

        const sources = {}
        sources[constants.SOURCES_DROPBOX] = {
            accessToken : 'some-token'
        }

        const exception = await ctx.assert.throws(async() => await helper.getFileLink(sources, 'my-profile', 'some-path') )    
        ctx.assert.equal(exception.inner.code, constants.ERROR_NO_INDEX_FILE)
    })

    
    it('sources/dropbox/helper/getFileLink::unhappy::unexpected error', async () => {
        const ctx = require(_$t+'testcontext'),
            helper = require(_$+'sources/dropbox/helper'),
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'lib/settings', {
            sandboxMode : true
        })

        ctx.inject.object('madscience-httputils', {
            post(){
                throw 'some-unexpected-error'
            }
        })

        const sources = {}
        sources[constants.SOURCES_DROPBOX] = {
            accessToken : 'some-token'
        }

        const exception = await ctx.assert.throws(async() => await helper.getFileLink(sources, 'my-profile', 'some-path') )    
        ctx.assert.equal(exception.inner.code, constants.ERROR_DEFAULT)

    })

})