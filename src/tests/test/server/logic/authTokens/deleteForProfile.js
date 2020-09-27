const mocha = require(_$t+'helpers/testbase')

mocha('logic/authTokens/deleteForProfile', async(ctx)=>{

    it('logic/authTokens/deleteForProfile::happy    deletes authTokens for a profile', async () => {

        let logic = require(_$+'logic/authToken'),
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
