describe('logic/eventLog/getActive', async()=>{

    it('logic/eventLog/getActive::happy::gets active eventLogs for a profile', async () => {
        const ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/eventLog')

        ctx.inject.object(_$+'cache/eventLog', {
            getActive (){
                return [{}, {}]
            }
        })

        const records = await logic.getActive()
        ctx.assert.equal(records.length, 2)
    })

})
