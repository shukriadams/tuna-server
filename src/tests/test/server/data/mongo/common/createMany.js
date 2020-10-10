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
})
