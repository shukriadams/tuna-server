describe('logic/logs/create', async()=>{

    it('logic/logs/create::happy::creates a log entry', async () => {

        // replace call to mongo
        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/log'),
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
