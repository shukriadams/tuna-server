describe('sources/importerBase/_processNextSong', ()=>{
    
    /**
     * 
     */
    it('sources/importerBase/_processNextSong::happy::processes new song', (done) => {
        const song = { 
                path : 'the-path',
                name : 'the-name',
                album : 'the-album',
                artist : 'the-artist'
            },
            ctx = require(_$t+'testcontext')

        
        ctx.inject.object(_$+'helpers/debounce', {
            debounce (key, interval, callback){
                callback()
            }
        })
        
        ctx.inject.object(_$+'helpers/socket', {
            send(){ }
        })
        
        let Importer = require(_$+'sources/importerBase'),
            importer = new Importer()

        // can't override class so do the instance of it instance
        importer = Object.assign(importer, {
            // song to import
            queuedSongs : [song], 

            // force token to enable sock progress alerts
             authTokenId : '123',
            
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
    

    /**
     * 
     */
    it('sources/importerBase/_processNextSong::happy::processes existing song', (done) => {
        const song = { 
                path : 'the-path',
                name : 'the-name',
                album : 'the-album',
                artist : 'the-artist'
            },
            ctx = require(_$t+'testcontext')

        
        ctx.inject.object(_$+'helpers/debounce', {
            debounce (key, interval, callback){
                callback()
            }
        })
        
        ctx.inject.object(_$+'helpers/socket', {
            send(){ }
        })
        
        let Importer = require(_$+'sources/importerBase'),
            importer = new Importer()

        // can't override class so do the instance of it instance
        importer = Object.assign(importer, {
            // song to import
            queuedSongs : [song], 

            // set importing song to already exist, this covers more code
            existingSongs : [song],
            
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

