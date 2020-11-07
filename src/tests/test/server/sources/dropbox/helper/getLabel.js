describe('sources/dropbox/helper/getLabel', ()=>{

    /**
     * for coverage mostly
    */
    it('sources/dropbox/helper/getLabel::happy::gets label', async () => {
        const ctx = require(_$t+'testcontext'),
            helper = require(_$+'sources/dropbox/helper'),
            label = await helper.getLabel() 
        
        ctx.assert.notNull(label)
    })

})