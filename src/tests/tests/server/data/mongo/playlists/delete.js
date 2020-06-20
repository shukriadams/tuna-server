const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('mongo/playlists/delete', async(testArgs)=>{

    it('happy path : deletes playlist', async () => {

        // replace call to mongo
        inject.object(_$+'data/mongo/common', {
            delete : (collection, id)=>{
                return id
            }
        })

        const mongo = require(_$+'data/mongo/playlist'),
            id = await mongo.delete('dafda')

        assert.equal(id, 'dafda')
    })

})
