const 
    assert = require('madscience-node-assert'),
    inject = require(_$t+'helpers/inject'),
    mocha = require(_$t+'helpers/testbase')

mocha('authTokensLogic : getById', async(testArgs)=>{

    it('happy path : gets authToken by id', async () => {

        let logic = require(_$+'logic/authToken')

        inject.object(_$+'cache/authToken', {
            getById : (id)=>{
                return { id }
            }
        })

        let actualAuthToken = await logic.getById('some-token-id')
        assert.equal(actualAuthToken.id, 'some-token-id')
    })

    it('happy path : gets authToken by null id', async () => {

        let logic = require(_$+'logic/authToken')

        inject.object(_$+'cache/authToken', {
            getById : (id)=>{
                return { id }
            }
        })

        let actualAuthToken = await logic.getById(null)
        assert.null(actualAuthToken)
    })

    it('happy path : gets authToken by empty id', async () => {

        let logic = require(_$+'logic/authToken')

        inject.object(_$+'cache/authToken', {
            getById : (id)=>{
                return { id }
            }
        })

        let actualAuthToken = await logic.getById()
        assert.null(actualAuthToken)
    })

})
