const mocha = require(_$t+'helpers/testbase')

mocha('logic/authTokens/getForProfile', async(ctx)=>{

    it('logic/authTokens/getForProfile::happy    gets authToken for profile', async () => {
        ctx.inject.object(_$+'cache/authToken', {
            getForProfile (profileId){
                return { profileId }
            }
        })

        const logic = require(_$+'logic/authToken'),
            actualAuthToken = await logic.getForProfile('some-profile')

        ctx.assert.equal(actualAuthToken.profileId, 'some-profile')
    })

})
