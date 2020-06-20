const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('songsData : delete', async(testArgs)=>{

    it('happy path : deletes song', async () => {

        let mongo = require(_$+'data/mongo/songs'),
            actualId 

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            delete : (collection, id)=>{
                actualId = id
            }
        })

        await mongo.delete('dafda')

        assert.equal(actualId, 'dafda')
    })

})
