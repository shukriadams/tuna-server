describe('mongo/common/findOne', async()=>{

    /**
     * forces error to cover exception code
     */
    it('mongo/common/findOne::unhappy::throws unhandled exception', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'helpers/mongo', {
            getCollection : ()=>{
                throw 'whatever'
            }
        })

        const common = require(_$+'data/mongo/common'),
            exception = await ctx.assert.throws(async() => await common.findOne() )        

        ctx.assert.equal(exception, 'whatever')
    })

    /**
     * forces error to cover exception code
     */
    it('mongo/common/findOne::unhappy::returns query error', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'helpers/mongo', {
            getCollection : ()=>{
                return {
                    collection : {
                        findOne (query, callback){
                            callback('findOne error')
                        }
                    }
                }
            }
        })

        const common = require(_$+'data/mongo/common'),
            exception = await ctx.assert.throws(async() => await common.findOne() )        

        ctx.assert.equal(exception, 'findOne error')
    })

})
