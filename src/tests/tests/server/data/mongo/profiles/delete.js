const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('mongo/profiles/delete', async(testArgs)=>{

    it('happy path : deletes profile', async () => {

        let mongo = require(_$+'data/mongo/profile'),
            actualId 

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            delete : (collection, id)=>{
                actualId = id
            }
        })

        await mongo.delete({ id : 'dafda'})

        assert.equal(actualId, 'dafda')
    })

})
