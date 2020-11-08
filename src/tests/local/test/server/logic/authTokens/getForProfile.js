describe('logic/authTokens/getForProfile', async()=>{

    it('logic/authTokens/getForProfile::happy::gets authToken for profile', async () => {
        const ctx = require(_$t+'testcontext')
        
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
