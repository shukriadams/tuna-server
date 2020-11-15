describe('logic/authTokens/deleteForProfile', async()=>{

    it('logic/authTokens/deleteForProfile::happy::deletes authTokens for a profile', async () => {

        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/authToken'),
            actualProfileId

        ctx.inject.object(_$+'cache/authToken', {
            deleteForProfile (profileId){
                actualProfileId = profileId
            }
        })

        await logic.deleteForProfile('some-profile')
        ctx.assert.equal(actualProfileId, 'some-profile')
    })

})
