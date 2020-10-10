describe('helpers/cache/flush', function(){

    it('helpers/cache/flush::happy::flushes cache', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'helpers/cache', {
            _initialize (){ 
                return {
                    flushAll(){
                        
                    }
                }
            } 
        })

        const cache = require(_$+'helpers/cache')
        await cache.flush()
        
        // no assert, this test is for coverage only
    })


    
    it('helpers/cache/flush::unhappy::throws unhandled exception query error', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'helpers/cache', {
            _initialize (){ 
                return {
                    flushAll(){
                        throw 'an error'
                    }
                }
            } 
        })

        const cache = require(_$+'helpers/cache')
        await ctx.assert.throws(async() => await cache.flush() )
        // no assert, this test is for coverage only
    })


    it('helpers/cache/flush::unhappy::returns query error', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'helpers/cache', {
            _initialize (){ 
                return {
                    set(key, obj, callback){
                        callback('an error')
                    }
                }
            } 
        })

        const cache = require(_$+'helpers/cache')
        await ctx.assert.throws(async() => await cache.flush() )    
        // no assert, this test is for coverage only
    })


    it('helpers/cache/flush::unhappy::cache create fail', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'helpers/cache', {
            _initialize (){ 
                return null
            } 
        })

        const cache = require(_$+'helpers/cache')
        await cache.flush()
        
        // no assert, this test is for coverage only
    })

})

