const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('profilesLogic : gets profile by identifier', async(testArgs)=>{

    it('happy path : gets all profiles', async () => {

        let logic = require(_$+'logic/profiles')

        inject.object(_$+'cache/profile', {
            getByIdentifier : ()=>{
                return {id : 'some-id'}
            }
        })

        const profile = await logic.getByIdentifier()
        assert.equal(profile.id, 'some-id')
    })

})
