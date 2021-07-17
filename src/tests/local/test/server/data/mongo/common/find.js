describe('mongo/common/find', async()=>{

    /**
     * forces error to cover exception code
     */
    it('mongo/common/find::unhappy::throws unhandled exception', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'lib/mongo', {
            getCollection : ()=>{
                throw 'whatever'
            }
        })

        const common = require(_$+'data/mongo/common'),
            exception = await ctx.assert.throws(async() => await common.find() )        

        ctx.assert.equal(exception, 'whatever')
    })

    /**
     * forces error to cover exception code
     */
    it('mongo/common/find::unhappy::returns query error', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'lib/mongo', {
            getCollection : ()=>{
                return {
                    collection : {
                        find (){
                            return {
                                toArray(callback){
                                    callback('find error')
                                }
                            }
                        }
                    }
                }
            }
        })

        const common = require(_$+'data/mongo/common'),
            exception = await ctx.assert.throws(async() => await common.find() )        

        ctx.assert.equal(exception, 'find error')
    })

})
