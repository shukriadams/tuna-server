const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('logic/logs/create', async(testArgs)=>{

    it('happy path : creates a log entry', async () => {

        // replace call to mongo
        let logic = require(_$+'logic/log'),
            actualLogEntry

        // log logic writes straight to db without caching
        inject.object(_$+'data/mongo/log', {
            create : (logEntry)=>{
                actualLogEntry = logEntry
            }
        })

        await logic.create({ data : 'some-data' }, 'some-context', 'some-profile' )

        assert.equal(actualLogEntry.profileId, 'some-profile')
        assert.equal(actualLogEntry.content.data, 'some-data')
        assert.equal(actualLogEntry.context, 'some-context')
    })


})
