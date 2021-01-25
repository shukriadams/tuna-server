describe('sources/dropbox/helper/swapCodeForToken', ()=>{
    
    it('sources/dropbox/helper/swapCodeForToken::happy::swaps code for token', async () => {
        let ctx = require(_$t+'testcontext'),
            updated = false,
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'helpers/settings', {
            sandboxMode : true
        })

        ctx.inject.object(_$+'logic/profiles', {
            getById(){
                const sources = {}
                    sources[constants.SOURCES_DROPBOX] = {}

                return {
                    sources
                }
            },
            update(){
                updated = true
            }
        })

        ctx.inject.object(_$+'sources/dropbox/helper', {
            post(options){
                const response = {
                        statusCode : 200
                    }, 
                    body = JSON.stringify({
                        access_token : 'some-token'
                    }) 
    
                return {response, body}
            }
        })

        const helper = require(_$+'sources/dropbox/helper')
        await helper.swapCodeForToken('profile-id', 'some-token') 
        ctx.assert.true(updated)
    })


    it('sources/dropbox/helper/swapCodeForToken::unhappy::unexpected error', async () => {
        let ctx = require(_$t+'testcontext'),
            helper = require(_$+'sources/dropbox/helper')

        ctx.inject.object(_$+'logic/profiles', {
            getById(){
                throw 'some-error'
            }
        })

        const exception = await ctx.assert.throws(async() => await helper.swapCodeForToken('profile-id', 'some-token') )    
        ctx.assert.equal(exception, 'some-error')
    })


    it('sources/dropbox/helper/swapCodeForToken::unhappy::request error', async () => {
        let ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants'),
            helper = require(_$+'sources/dropbox/helper')

            ctx.inject.object(_$+'logic/profiles', {
                getById(){
                    const sources = {}
                        sources[constants.SOURCES_DROPBOX] = {}
    
                    return {
                        sources
                    }
                }
            })

        ctx.inject.function('request', (options, callback)=>{
            // 1ist arg is error, 2nd is response 
            callback(null, { 
                statusCode : 499
            })
        })

        const exception = await ctx.assert.throws(async() => await helper.swapCodeForToken('profile-id', 'some-token') )    
        ctx.assert.includes(exception.inner.text, '499')
    })

    it('sources/dropbox/helper/swapCodeForToken::unhappy::dropbox error', async () => {
        let ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants'),
            helper = require(_$+'sources/dropbox/helper')

            ctx.inject.object(_$+'logic/profiles', {
                getById(){
                    const sources = {}
                        sources[constants.SOURCES_DROPBOX] = {}
    
                    return {
                        sources
                    }
                }
            })

            ctx.inject.function('request', (options, callback)=>{
                const response = {
                    statusCode : 501
                }
    
                // null err @ response level, but with dropbox error code
                callback(null, response, body)
            })

        const exception = await ctx.assert.throws(async() => await helper.swapCodeForToken('profile-id', 'some-token') )    
        ctx.assert.includes(exception.inner.text, 'threw http error')
    })


    it('sources/dropbox/helper/swapCodeForToken::unhappy::profile update error', async () => {
        let ctx = require(_$t+'testcontext'),
            helper = require(_$+'sources/dropbox/helper'),
            updated = false,
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'helpers/settings', {
            sandboxMode : true
        })

        ctx.inject.object(_$+'logic/profiles', {
            getById(){
                const sources = {}
                    sources[constants.SOURCES_DROPBOX] = {}

                return {
                    sources
                }
            },
            update(){
                throw 'some-update-error'
            }
        })

        ctx.inject.function('request', (options, callback)=>{
            const response = {
                    statusCode : 200
                }, 
                body = JSON.stringify({
                    access_token : 'some-token'
                }) 

            // null err
            callback(null, response, body)
        })

        const exception = await ctx.assert.throws(async() => await helper.swapCodeForToken('profile-id', 'some-token') )    
        ctx.assert.includes(exception, 'some-update-error')
    })
})