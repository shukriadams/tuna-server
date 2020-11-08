describe('sources/nextcloud/helper/getLabel', ()=>{

    /**
     * for coverage mostly
    */
    it('sources/nextcloud/helper/getLabel::happy::gets label', async () => {
        const ctx = require(_$t+'testcontext'),
            helper = require(_$+'sources/nextcloud/helper'),
            label = await helper.getLabel() 
        
        ctx.assert.equal(label, 'NextCloud')
    })

})