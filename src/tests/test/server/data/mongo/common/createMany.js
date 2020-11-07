describe('mongo/common/createMany', async()=>{

    it('mongo/common/createMany::happy::create record id', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'helpers/mongo', {
            getCollection : ()=>{
                return {
                    done(){ },
                    collection : {
                        insertMany (query, callback){
                            callback(null,  [ 'created many'] )
                        }
                    }
                }
            }
        })

        const mongo = require(_$+'data/mongo/common'),
            records = await mongo.createMany('collection', ['123', 456] )

        ctx.assert.equal(records, 2) // length of array passed to createMany
    })

    it('mongo/common/createMany::unhappy::returns query error', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'helpers/mongo', {
            getCollection : ()=>{
                return {
                    done(){ },
                    collection : {
                        insertMany (query, callback){
                            callback('an error')
                        }
                    }
                }
            }
        })

        const common = require(_$+'data/mongo/common'),
            exception = await ctx.assert.throws(async() => await common.createMany('collection',  ['123', 456]) )    

        ctx.assert.equal(exception, 'an error')
    })


    /**
     * forces error to cover exception code
     */
    it('mongo/common/createMany::unhappy::throws unhandled exception', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'helpers/mongo', {
            getCollection : ()=>{
                throw 'whatever'
            }
        })

        const common = require(_$+'data/mongo/common'),
            exception = await ctx.assert.throws(async() => await common.createMany('collection', ['123', 456]) )        

        ctx.assert.equal(exception, 'whatever')
    })    
    
})
