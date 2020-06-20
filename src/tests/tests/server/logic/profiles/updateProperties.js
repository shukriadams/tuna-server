const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('profilesLogic : updates profile properties', async(testArgs)=>{

    it('happy path : updates profile properties', async () => {
        
        inject.object(_$+'logic/profiles', {
            getById: ()=>{
                return { id : null }
            },
            update : (properties)=>{
                return properties
            }
        })

        const logic = require(_$+'logic/profiles'),
            properties = await logic.updateProperties({ id : 'some-id'})
            
        assert.equal(properties.id, 'some-id')
    })

})
