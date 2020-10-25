describe('sources/importerBase/_processNextSong', ()=>{
    
    /**
     * 
     */
    it('sources/importerBase/_processNextSong::happy::processes song', (done) => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'helpers/debounce', (key, interval, callback)=>{
            // call immediately 
            callback()
        })

        ctx.inject.object(_$+'helpers/socket', {
            send(){ }
        })
        
        let Importer = require(_$+'sources/importerBase'),
            importer = new Importer()

        // can't override class so do the instance of it instance
        importer = Object.assign(importer, {
            // song to import
            queuedSongs : [{ 
                path : 'the-path',
                name : 'the-name',
                album : 'the-album',
                artist : 'the-artist'
            }], 

            // import loom is callback based, so we need to hook up to importer's own finish handler to know when test terminates.
            // do asserts in here 
            _finish(){

                ctx.assert.equal(1, importer.completedSongsCount)
                done()
                
            }
        })

        // start, wait for _finish() to get called
        importer._processNextSong()

    })
    
})

