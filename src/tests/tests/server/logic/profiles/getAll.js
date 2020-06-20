const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('profilesLogic : gets all profiles', async(testArgs)=>{

    it('happy path : gets all profiles', async () => {

        let logic = require(_$+'logic/profiles')

        inject.object(_$+'cache/profile', {
            getAll : ()=>{
                return [{id : 'some-id'}]
            }
        })

        const profiles = await logic.getAll()
        assert.true(profiles.length, 1)
        assert.equal(profiles[0].id, 'some-id')
    })

})
