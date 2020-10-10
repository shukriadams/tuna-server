describe('mongo/common/create', async()=>{

    it('mongo/common/create::happy::create record id', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'helpers/mongo', {
            getCollection : ()=>{
                return {
                    done(){ },
                    collection : {
                        insertOne (query, callback){
                            callback(null, { ops: [ 'created'] })
                        }
                    }
                }
            }
        })

        const mongo = require(_$+'data/mongo/common'),
            record = await mongo.create('collection', {} )

        ctx.assert.equal(record, 'created')
    })

    it('mongo/common/create::unhappy::reject null record', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'helpers/mongo', {
            getCollection : ()=>{
                return {
                    done(){ },
                    collection : {
                        insertOne (query, callback){
                            callback(null, { ops: [ 'created'] })
                        }
                    }
                }
            }
        })

        const common = require(_$+'data/mongo/common'),
            constants = require(_$+'types/constants'),
            exception = await ctx.assert.throws(async() => await common.create('collection', null) )    

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_ARGUMENT)
    })
})
