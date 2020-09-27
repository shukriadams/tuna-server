const mocha = require(_$t+'helpers/testbase')

mocha('logic/logs/create', async(ctx)=>{

    it('logic/logs/create::happy    creates a log entry', async () => {

        // replace call to mongo
        let logic = require(_$+'logic/log'),
            actualLogEntry

        // log logic writes straight to db without caching
        ctx.inject.object(_$+'data/mongo/log', {
            create (logEntry){
                actualLogEntry = logEntry
            }
        })

        await logic.create({ data : 'some-data' }, 'some-context', 'some-profile' )

        ctx.assert.equal(actualLogEntry.profileId, 'some-profile')
        ctx.assert.equal(actualLogEntry.content.data, 'some-data')
        ctx.assert.equal(actualLogEntry.context, 'some-context')
    })


})
