const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokensLogic : deleteForProfile', async(testArgs)=>{

    it('happy path : deletes authTokens for a profile', async () => {

        let logic = require(_$+'logic/authToken'),
            actualProfileId

        inject.object(_$+'cache/authToken', {
            deleteForProfile : (profileId)=>{
                actualProfileId = profileId
            }
        })

        await logic.deleteForProfile('some-profile')
        assert.equal(actualProfileId, 'some-profile')
    })

})
