describe('logic/authTokens/getById', async()=>{

    it('logic/authTokens/getById::happy::gets authToken by id', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'cache/authToken', {
            getById (id){
                return { id }
            }
        })

        const logic = require(_$+'logic/authToken'),
            actualAuthToken = await logic.getById('some-token-id')

        ctx.assert.equal(actualAuthToken.id, 'some-token-id')
    })




    it('logic/authTokens/getById::happy::gets authToken by null id', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'cache/authToken', {
            getById (id){
                return { id }
            }
        })

        const logic = require(_$+'logic/authToken'),
            actualAuthToken = await logic.getById(null)

        ctx.assert.null(actualAuthToken)
    })




    it('logic/authTokens/getById::happy::gets authToken by empty id', async () => {
        const ctx = require(_$t+'testcontext')
        
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
