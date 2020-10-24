describe('helpers/daemon/tick', function(){

    it('helpers/daemon/tick::happy::ticks', async () => {
        let ctx = require(_$t+'testcontext'),
            settings = require( _$+'helpers/settings'),
            sources = {}

            sources[settings.musicSource] = {}

        
        ctx.inject.object(_$+'logic/profiles', {
            getAll (){ 
                return [{ sources }]
            } 
        })

        ctx.inject.object(_$+'sources/provider', {
            get(){ },
            getImporter(){
                return class{
                    start(){ }
                }
            }
        })

        ctx.inject.object(_$+'helpers/sourceCommon', {
            isRemoteNewer(){ 
                return true
            }
        })

        const daemon = require(_$+'helpers/daemon')
        await daemon.tick()
    })



    /**
     * Force throwing of error in main process try, needed for code coverage
    */
    it('helpers/daemon/tick::unhappy::import exception', async () => {
        let ctx = require(_$t+'testcontext'),
            settings = require( _$+'helpers/settings'),
            sources = {}

        sources[settings.musicSource] = {}
        
        ctx.inject.object(_$+'logic/profiles', {
            getAll (){ 
                return [{ sources }]
            } 
        })

        ctx.inject.object(_$+'sources/provider', {
            get(){ },
            getImporter(){
                return class{
                    start(){
                        throw 'some-error'
                    }
                }
            }
        })

        ctx.inject.object(_$+'helpers/sourceCommon', {
            isRemoteNewer(){ 
                return true
            }
        })

        const daemon = require(_$+'helpers/daemon')
        await daemon.tick()
    })


    /**
     * Force throwing of error in outer try, needed for code coverage
    */
   it('helpers/daemon/tick::unhappy::import exception 2', async () => {
        let ctx = require(_$t+'testcontext'),
            settings = require( _$+'helpers/settings'),
            sources = {}

        sources[settings.musicSource] = {}
        
        ctx.inject.object(_$+'logic/profiles', {
            getAll (){ 
                throw 'an error'
            } 
        })

        const daemon = require(_$+'helpers/daemon')
        await daemon.tick()
    })


    /**
     * handles profile with no sources - needed for code coverage
     */
    it('helpers/daemon/tick::unhappy::no sources', async () => {
        let ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'logic/profiles', {
            getAll (){ 
                return [{ }] // return profile without sources
            } 
        })
 
        const daemon = require(_$+'helpers/daemon')
        await daemon.tick()
    })

})

