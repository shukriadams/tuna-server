describe('sources/dropbox/helper/swapCodeForToken', ()=>{
    
    it('sources/dropbox/helper/swapCodeForToken::happy::swaps code for token', async () => {
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
                updated = true
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
            callback('some-err')
        })

        const exception = await ctx.assert.throws(async() => await helper.swapCodeForToken('profile-id', 'some-token') )    
        ctx.assert.equal(exception, 'some-err')
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
                        statusCode : 500
                    }, 
                    body = 'some-dropbox-error' 
    
                // null err @ response level, but with dropbox error code
                callback(null, response, body)
            })

        const exception = await ctx.assert.throws(async() => await helper.swapCodeForToken('profile-id', 'some-token') )    
        ctx.assert.includes(exception.log, 'some-dropbox-error')
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