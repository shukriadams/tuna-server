describe('helpers/cache/remove', function(){

    it('helpers/cache/remove::happy::removes item from cache', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'lib/cache', {
            _initialize (){ 
                return {
                    del(key, callback){
                        callback(null) // null = no error
                    }
                }
            } 
        })

        const cache = require(_$+'lib/cache')
        await cache.remove()
        
        // no assert, this test is for coverage only
    })


    it('helpers/cache/remove::unhappy::throws unhandled exception query error', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'lib/cache', {
            _initialize (){ 
                return {
                    del(){
                        throw 'an error'
                    }
                }
            } 
        })

        const cache = require(_$+'lib/cache')
        await ctx.assert.throws(async() => await cache.remove() )
        // no assert, this test is for coverage only
    })


    it('helpers/cache/remove::unhappy::returns query error', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'lib/cache', {
            _initialize (){ 
                return {
                    del(key, callback){
                        callback('an error')
                    }
                }
            } 
        })

        const cache = require(_$+'lib/cache')
        await ctx.assert.throws(async() => await cache.remove() )
        // no assert, this test is for coverage only
    })


    it('helpers/cache/remove::unhappy::cache create fail', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'lib/cache', {
            _initialize (){ 
                return null
            } 
        })

        const cache = require(_$+'lib/cache')
        await cache.remove()
        
        // no assert, this test is for coverage only
    })

})

