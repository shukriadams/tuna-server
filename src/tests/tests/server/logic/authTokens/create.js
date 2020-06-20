const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('logic/authTokens/create', async(testArgs)=>{

    it('happy path : creates auth token, no existing sessions', async () => {

        // replace call to mongo
        let logic = require(_$+'logic/authToken'),
            actualProfileId,
            actualBrowserUID

        inject.object(_$+'cache/authToken', {
            deleteForContext : (profileId, browserUID)=>{
                actualProfileId = profileId
                actualBrowserUID = browserUID
            },
            create : (authToken)=>{
                return authToken
            },
            getForProfile : ()=>{
                // return no existing sessions
                return []
            }
        })

        let actualAuthToken = await logic.create('some-profile', 'some-browserUID', 'some-userAgent')

        assert.equal(actualProfileId, 'some-profile')
        assert.equal(actualBrowserUID, 'some-browserUID')
        assert.equal(actualAuthToken.profileId, 'some-profile')
        assert.equal(actualAuthToken.context, 'some-browserUID')
        assert.equal(actualAuthToken.userAgent, 'some-userAgent')
    })

    it('happy path : creates auth token, too many existing sessions', async () => {

        // replace call to mongo
        let logic = require(_$+'logic/authToken'),
            actualDeletedId

        // lower amount so we can trigger cleanup logic
        inject.object(_$+'helpers/settings', {
            maxSessionsPerUser : 0
        })

        inject.object(_$+'cache/authToken', {
            deleteForContext : ()=>{
            },
            delete : (id)=> {
                actualDeletedId = id
            },
            create : (authToken)=>{
                return authToken
            },
            getForProfile : ()=>{
                // return on existing session to trigger cleanup
                return [{ id : 'some-token-id'}]
            }
        })

        await logic.create('some-profile', 'some-browserUID', 'some-userAgent')

        assert.equal(actualDeletedId, 'some-token-id')
    })

})
