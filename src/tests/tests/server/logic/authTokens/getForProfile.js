const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokensLogic : getForProfile', async(testArgs)=>{

    it('happy path : gets authToken for profile', async () => {

        let logic = require(_$+'logic/authToken')

        inject.object(_$+'cache/authToken', {
            getForProfile : (profileId)=>{
                return { profileId }
            }
        })

        let actualAuthToken = await logic.getForProfile('some-profile')
        assert.equal(actualAuthToken.profileId, 'some-profile')
    })

})
