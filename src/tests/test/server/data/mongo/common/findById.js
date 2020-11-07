describe('mongo/common/findById', async()=>{

    it('mongo/common/findById::happy::gets by id', async () => {
        const ctx = require(_$t+'testcontext')
        
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/common', {
            findOne (collection, query){
                return 'some-id' 
            }
        })
        
        const mongo = require(_$+'data/mongo/common'),
            record = await mongo.findById('dafda')

        ctx.assert.equal(record, 'some-id')
    })

    it('mongo/common/findById::unhappy::returns null on invalid id', async () => {
        const ctx = require(_$t+'testcontext'),
            mongo = require(_$+'data/mongo/common'),
            record = await mongo.findById('dafda', 'will fail to parse to objectid')
            
        ctx.assert.null(record)
    })

})
