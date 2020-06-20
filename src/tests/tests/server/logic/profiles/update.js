const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/update', async(testArgs)=>{

    it('happy path : updates profile', async () => {
        
        inject.object(_$+'logic/profiles', {
            update : (profile)=>{
                return profile
            }
        })

        const logic = require(_$+'logic/profiles'),
            properties = await logic.update({ id : 'some-id'})
            
        assert.equal(properties.id, 'some-id')
    })

})
