describe('logic/authTokens/create', async()=>{

    it('logic/authTokens/create::happy::creates auth token, no existing sessions', async () => {

        // replace call to mongo
        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/authToken'),
            actualProfileId,
            actualBrowserUID

        ctx.inject.object(_$+'cache/authToken', {
            deleteForContext (profileId, browserUID){
                actualProfileId = profileId
                actualBrowserUID = browserUID
            },
            create (authToken){
                return authToken
            },
            getForProfile (){
                // return no existing sessions
                return []
            }
        })

        let actualAuthToken = await logic.create('some-profile', 'some-browserUID', 'some-userAgent')

        ctx.assert.equal(actualProfileId, 'some-profile')
        ctx.assert.equal(actualBrowserUID, 'some-browserUID')
        ctx.assert.equal(actualAuthToken.profileId, 'some-profile')
        ctx.assert.equal(actualAuthToken.context, 'some-browserUID')
        ctx.assert.equal(actualAuthToken.userAgent, 'some-userAgent')
    })



    it('logic/authTokens/create::happy::creates auth token, too many existing sessions', async () => {

        // replace call to mongo
        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/authToken'),
            actualDeletedId

        // lower amount so we can trigger cleanup logic
        ctx.inject.object(_$+'lib/settings', {
            maxSessionsPerUser : 0
        })

        ctx.inject.object(_$+'cache/authToken', {
            deleteForContext (){
            },
            delete (id){
                actualDeletedId = id
            },
            create (authToken){
                return authToken
            },
            getForProfile(){
                // return on existing session to trigger cleanup
                return [{ id : 'some-token-id'}]
            }
        })

        await logic.create('some-profile', 'some-browserUID', 'some-userAgent')

        ctx.assert.equal(actualDeletedId, 'some-token-id')
    })

})
