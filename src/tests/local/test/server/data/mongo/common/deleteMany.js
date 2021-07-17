describe('mongo/common/deleteMany', async()=>{

    it('mongo/common/deleteMany::happy::deletes records', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'lib/mongo', {
            getCollection : ()=>{
                return {
                    done(){ },
                    collection : {
                        deleteMany (query, callback){
                            callback(null)
                        }
                    }
                }
            }
        })

        const mongo = require(_$+'data/mongo/common')
        await mongo.deleteMany('collection', {})

        // no assert, this is for test coverage
    })


    it('mongo/common/deleteMany::unhappy::returns query error', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'lib/mongo', {
            getCollection : ()=>{
                return {
                    done(){ },
                    collection : {
                        deleteMany (query,  callback){
                            callback('an error')
                        }
                    }
                }
            }
        })

        const common = require(_$+'data/mongo/common'),
            exception = await ctx.assert.throws(async() => await common.deleteMany('collection', {}))

        ctx.assert.equal(exception, 'an error')
    })


    /**
     * forces error to cover exception code
     */
    it('mongo/common/deleteMany::unhappy::throws unhandled exception', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'lib/mongo', {
            getCollection : ()=>{
                throw 'whatever'
            }
        })

        const common = require(_$+'data/mongo/common'),
            exception = await ctx.assert.throws(async() => await common.deleteMany('collection', {}))

        ctx.assert.equal(exception, 'whatever')
    })  
})
