describe('sources/dropbox/helper/ensureIntegration', ()=>{

    /**
     * for coverage
    */
    it('sources/dropbox/helper/ensureIntegration::happy::ensures integration', async () => {
        const helper = require(_$+'sources/dropbox/helper')
        await helper.ensureIntegration() 
    })

})