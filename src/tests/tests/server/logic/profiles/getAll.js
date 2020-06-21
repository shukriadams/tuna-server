const mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/getAll', async(ctx)=>{

    it('logic/profiles/getAll::happy    gets all profiles', async () => {
        ctx.inject.object(_$+'cache/profile', {
            getAll (){
                return [{id : 'some-id'}]
            }
        })

        const logic = require(_$+'logic/profiles'),
            profiles = await logic.getAll()

        ctx.assert.true(profiles.length, 1)
        ctx.assert.equal(profiles[0].id, 'some-id')
    })

})
