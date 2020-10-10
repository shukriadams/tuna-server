describe('mongo/common/delete', async()=>{

    it('mongo/common/delete::happy::deletes record', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'helpers/mongo', {
            getCollection : ()=>{
                return {
                    done(){ },
                    collection : {
                        deleteOne (query, callback){
                            callback(null)
                        }
                    }
                }
            }
        })

        const mongo = require(_$+'data/mongo/common')
        await mongo.delete('collection', ctx.mongoId, {})

        // no assert, this is for test coverage
    })


    it('mongo/common/delete::unhappy::returns query error', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'helpers/mongo', {
            getCollection : ()=>{
                return {
                    done(){ },
                    collection : {
                        deleteOne (query,  callback){
                            callback('an error')
                        }
                    }
                }
            }
        })

        const common = require(_$+'data/mongo/common'),
            exception = await ctx.assert.throws(async() => await common.delete('collection', ctx.mongoId, {}))

        ctx.assert.equal(exception, 'an error')
    })


    /**
     * forces error to cover exception code
     */
    it('mongo/common/delete::unhappy::throws unhandled exception', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'helpers/mongo', {
            getCollection : ()=>{
                throw 'whatever'
            }
        })

        const common = require(_$+'data/mongo/common'),
            exception = await ctx.assert.throws(async() => await common.delete('collection', ctx.mongoId, {}))

        ctx.assert.equal(exception, 'whatever')
    })  
})
