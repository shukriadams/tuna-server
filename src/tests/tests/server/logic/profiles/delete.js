const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/delete', async(testArgs)=>{

    it('happy path : deletes a profile', async () => {

        let logic = require(_$+'logic/profiles'),
            cacheProfile,
            authTokenId,
            songsId

        inject.object(_$+'cache/profile', {
            delete : (profile)=>{
                cacheProfile = profile
            }
        })

        inject.object(_$+'logic/authToken', {
            deleteForProfile : (profileId)=>{
                authTokenId = profileId
            }
        })

        inject.object(_$+'logic/songs', {
            deleteForProfile : (profileId)=>{
                songsId = profileId
            }
        })

        await logic.delete({id : 'some-profile'})
        assert.equal(cacheProfile.id, 'some-profile')
        assert.equal(authTokenId, 'some-profile')
        assert.equal(songsId, 'some-profile')
    })

})
