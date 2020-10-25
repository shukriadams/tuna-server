describe('sources/importerBase/_finish', ()=>{
    
    /**
     * 
     */
    it('sources/importerBase/_finish::happy::finishes processing', async () => {
        const ctx = require(_$t+'testcontext'),
            theSong = { 
                id : 'the-id',
                path : 'the-path',
                name : 'the-name',
                album : 'the-album',
                artist : 'the-artist'
            }

        ctx.inject.object(_$+'helpers/debounce', (key, interval, callback)=>{
            // call immediately 
            callback()
        })

        ctx.inject.object(_$+'helpers/socket', {
            send(){ }
        })
        
        ctx.inject.object(_$+'logic/playlists', {
            getAll(){ return [ { songs : ['the-id'] }] }, // add song being added to existing playlist so it gets deleted as well. for code coverage
            update(){ }
        })
        
        ctx.inject.object(_$+'logic/profiles', {
            update(){ }
        })

        ctx.inject.object(_$+'logic/authToken', {
            getForProfile(){  return [ {} ] }
        })

        ctx.inject.object(_$+'logic/songs', {
            createMany(){ },
            update(){ },
            delete(){ },
            getAll(){ return [theSong] }
        })

        let isDone = false,
            Importer = require(_$+'sources/importerBase'),
            importer = new Importer()



        // can't override class so do the instance of it instance
        importer = Object.assign(importer, {
            insertQueue : [theSong],
            updateQueue : [theSong],
            _onDone(){
                isDone = true
            },
            _getSource(){
                return {
                    profile : {},
                    source : {}
                }
            }

        })

        // start, wait for _finish() to get called
        await importer._finish()
        ctx.assert.true(isDone)
    })
    
})

