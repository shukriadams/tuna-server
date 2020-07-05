const mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/getByIdentifier', async(ctx)=>{

    it('logic/profiles/getByIdentifier::happy    gets all profiles', async () => {
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
