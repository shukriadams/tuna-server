describe('logic/profiles/delete', async()=>{

    it('logic/profiles/delete::happy::deletes a profile', async () => {

        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/profiles'),
            cacheProfile,
            authTokenId,
            songsId

        ctx.inject.object(_$+'cache/profile', {
            delete (profile){
                cacheProfile = profile
            }
        })

        ctx.inject.object(_$+'logic/authToken', {
            deleteForProfile (profileId){
                authTokenId = profileId
            }
        })

        ctx.inject.object(_$+'logic/songs', {
            deleteForProfile (profileId){
                songsId = profileId
            }
        })

        await logic.delete({id : 'some-profile'})
        ctx.assert.equal(cacheProfile.id, 'some-profile')
        ctx.assert.equal(authTokenId, 'some-profile')
        ctx.assert.equal(songsId, 'some-profile')
    })

})
