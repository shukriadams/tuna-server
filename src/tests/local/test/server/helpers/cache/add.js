describe('helpers/cache/add', function(){

    it('helpers/cache/add::happy::adds item to cache', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'lib/cache', {
            _initialize (){ 
                return {
                    set(key, obj, callback){
                        callback()
                    }
                }
            } 
        })

        const cache = require(_$+'lib/cache')
        await cache.add('key', {})
        
        // no assert, this test is for coverage only
    })


    it('helpers/cache/add::unhappy::returns query error', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'lib/cache', {
            _initialize (){ 
                return {
                    set(key, obj, callback){
                        callback('an error')
                    }
                }
            } 
        })

        const cache = require(_$+'lib/cache')
        await ctx.assert.throws(async() => await cache.add('key', {}) )    
        // no assert, this test is for coverage only
    })


    it('helpers/cache/add::unhappy::throws unhandled exception query error', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'lib/cache', {
            _initialize (){ 
                return {
                    set(){
                        throw 'an error'
                    }
                }
            } 
        })

        const cache = require(_$+'lib/cache')
        await ctx.assert.throws(async() => await cache.add('key', {}) )    
        // no assert, this test is for coverage only
    })


    it('helpers/cache/add::unhappy::cache create fail', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'lib/cache', {
            _initialize (){ 
                return null
            } 
        })

        const cache = require(_$+'lib/cache')
        await cache.add()
        
        // no assert, this test is for coverage only
    })

})

