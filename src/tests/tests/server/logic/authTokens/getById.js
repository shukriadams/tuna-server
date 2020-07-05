const mocha = require(_$t+'helpers/testbase')

mocha('logic/authTokens/getById', async(ctx)=>{

    it('logic/authTokens/getById::happy    gets authToken by id', async () => {
        ctx.inject.object(_$+'cache/authToken', {
            getById (id){
                return { id }
            }
        })

        const logic = require(_$+'logic/authToken'),
            actualAuthToken = await logic.getById('some-token-id')

        ctx.assert.equal(actualAuthToken.id, 'some-token-id')
    })




    it('logic/authTokens/getById::happy    gets authToken by null id', async () => {
        ctx.inject.object(_$+'cache/authToken', {
            getById (id){
                return { id }
            }
        })

        const logic = require(_$+'logic/authToken'),
            actualAuthToken = await logic.getById(null)

        ctx.assert.null(actualAuthToken)
    })




    it('logic/authTokens/getById::happy    gets authToken by empty id', async () => {

        ctx.inject.object(_$+'cache/authToken', {
            getById (id){
                return { id }
            }
        })

        const logic = require(_$+'logic/authToken'),
            actualAuthToken = await logic.getById()

        ctx.assert.null(actualAuthToken)
    })

})
