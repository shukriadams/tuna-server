describe('cache/eventLogs/clear', async(ctx)=>{

    it('cache/eventLogs/clear::happy::clear eventLogs', async () => {
        let ctx = require(_$t+'testcontext'),
            profileCalled,
            typeCalled,
            cache = require(_$+'cache/eventLog')

        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/eventLog', {
            clear(profileId, type){
                profileCalled = profileId
                typeCalled = type
            }
        })
        

        await cache.clear('my-profile', 'my-type')

        ctx.assert.equal(profileCalled, 'my-profile')
        ctx.assert.equal(typeCalled, 'my-type')
    })

})
