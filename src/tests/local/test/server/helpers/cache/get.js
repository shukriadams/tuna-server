describe('helpers/cache/get', function(){

    it('helpers/cache/get::happy::get item from cache', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'helpers/cache', {
            _initialize (){ 
                return {
                    get(key, callback){
                        callback(null, {}) // null = no error
                    }
                }
            } 
        })

        const cache = require(_$+'helpers/cache')
        await cache.get('key')
        
        // no assert, this test is for coverage only
    })


    it('helpers/cache/get::unhappy::throws unhandled exception query error', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'helpers/cache', {
            _initialize (){ 
                return {
                    get(){
                        throw 'an error'
                    }
                }
            } 
        })

        const cache = require(_$+'helpers/cache')
        await ctx.assert.throws(async() => await cache.get('key') )
        // no assert, this test is for coverage only
    })


    it('helpers/cache/get::unhappy::returns query error', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'helpers/cache', {
            _initialize (){ 
                return {
                    get(key, callback){
                        callback('an error')
                    }
                }
            } 
        })

        const cache = require(_$+'helpers/cache')
        await ctx.assert.throws(async() => await cache.get('key') )    
        // no assert, this test is for coverage only
    })


    it('helpers/cache/get::unhappy::cache create fail', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'helpers/cache', {
            _initialize (){ 
                return null
            } 
        })

        const cache = require(_$+'helpers/cache')
        await cache.get('key')
        
        // no assert, this test is for coverage only
    })

})

