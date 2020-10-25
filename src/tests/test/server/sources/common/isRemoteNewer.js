describe('sources/common/isRemoteNewer', ()=>{
    
    it('sources/common/isRemoteNewer::happy::returns true', async () => {
        const ctx = require(_$t+'testcontext'),
            settings = require(_$+'helpers/settings'),
            // set up profile with valid source, with old last import
            profile = { sources : {} }
        
        profile.sources[settings.musicSource] = {
            indexImportDate : new Date('1970').getTime()
        }

        ctx.inject.object(_$+'sources/provider', {
            getSource(){
                return {
                    ensureIntegration(){

                    },
                    downloadAsString(){
                        return JSON.stringify({
                            date : new Date().getTime()
                        })
                    }
                }
            }
        })

        const common = require(_$+'sources/common'),
            resuslt = await common.isRemoteNewer(profile) 

        ctx.assert.true(resuslt)
    })
    
})

