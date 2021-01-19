describe('sources/nextcloud/helper/ensureIntegration', ()=>{

    it('sources/nextcloud/helper/ensureIntegration::happy::ensures integration token expired', async () => {
        const ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'logic/profiles', {
            getById (){
                let sources = {}
                sources[constants.SOURCES_NEXTCLOUD] = {
                    tokenDate : '2000-1-1',
                    expiresIn : 0
                }

                return {
                    sources
                }
            }

        })
    })

})