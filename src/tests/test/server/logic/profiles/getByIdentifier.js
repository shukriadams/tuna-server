describe('logic/profiles/getByIdentifier', async()=>{

    it('logic/profiles/getByIdentifier::happy::gets all profiles', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'cache/profile', {
            getByIdentifier (){
                return {id : 'some-id'}
            }
        })

        const logic = require(_$+'logic/profiles'),
            profile = await logic.getByIdentifier()

        ctx.assert.equal(profile.id, 'some-id')
    })

})
