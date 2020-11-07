describe('sources/dropbox/importer/_readIndices', ()=>{

    it('sources/dropbox/importer/_readIndices::happy::read indices', async () => {
        
        let ctx = require(_$t+'testcontext'),
            Importer = require(_$+'sources/dropbox/importer')
            constants = require(_$+'types/constants'),
            importer = new Importer()

        // classes can't be require-overridden, so monkeypatch
        importer = Object.assign(importer, {
            _getSource(){
                return {
                    profile : {},
                    source : {
                        accessToken : 'some-token',
                        index : {
                            path : 'some-path'
                        }
                    }
                }
            }
        })

        ctx.inject.object(_$+'sources/dropbox/helper', {
            downloadAsString(){
                // return header + single line for single song
                return `{ "hash" : "some-hash" }\n
                    { "song" : "a-single-song" }\n
                `
            }
        })
        
        await importer._readIndices()
        // must be a single song
        ctx.assert.single(importer.queuedSongs)
    })


    /**
     * This test is mostly for coverage
    */
    it('sources/dropbox/importer/_readIndices::happy::read empty index', async () => {
        
        let ctx = require(_$t+'testcontext'),
            Importer = require(_$+'sources/dropbox/importer')
            constants = require(_$+'types/constants'),
            importer = new Importer()

        // classes can't be require-overridden, so monkeypatch
        importer = Object.assign(importer, {
            _getSource(){
                return {
                    profile : {},
                    source : {
                        accessToken : 'some-token',
                        index : {
                            path : 'some-path'
                        }
                    }
                }
            }
        })

        ctx.inject.object(_$+'sources/dropbox/helper', {
            downloadAsString(){
                // return header + nothing else
                return `{ "hash" : "some-hash" }`
            }
        })
        
        await importer._readIndices()
        ctx.assert.empty(importer.queuedSongs)
    })


    /**
     * this test is for coverage
     */
    it('sources/dropbox/importer/_readIndices::unhappy::invalid index json', async () => {
        
        let ctx = require(_$t+'testcontext'),
            Importer = require(_$+'sources/dropbox/importer')
            constants = require(_$+'types/constants'),
            importer = new Importer()

        // classes can't be require-overridden, so monkeypatch
        importer = Object.assign(importer, {
            _getSource(){
                return {
                    profile : {},
                    source : {
                        accessToken : 'some-token',
                        index : {
                            path : 'some-path'
                        }
                    }
                }
            }
        })

        ctx.inject.object(_$+'sources/dropbox/helper', {
            downloadAsString(){
                // return header line + invalid line
                return `{ "hash" : "some-hash" }\n
                    { this-is-invalid-json! }\n
                `
            }
        })
        
        await importer._readIndices()
        // queued songs empty
        ctx.assert.empty(importer.queuedSongs)
    })


    /**
     * For coveage
     */
    it('sources/dropbox/importer/_readIndices::unhappy::no access token', async () => {
        
        let ctx = require(_$t+'testcontext'),
            Importer = require(_$+'sources/dropbox/importer')
            constants = require(_$+'types/constants'),
            importer = new Importer()

        // classes can't be require-overridden, so monkeypatch
        importer = Object.assign(importer, {
            _getSource(){
                return {
                    profile : {},
                    source : {
                        accessToken : null,
                        index : {
                            path : 'some-path'
                        }
                    }
                }
            }
        })

        const exception = await ctx.assert.throws(async() => await importer._readIndices() )
        ctx.assert.equal(exception.log, 'accessToken not found')
    })


     /**
     * For coveage
     */
    it('sources/dropbox/importer/_readIndices::unhappy::no index', async () => {
        
        let ctx = require(_$t+'testcontext'),
            Importer = require(_$+'sources/dropbox/importer')
            constants = require(_$+'types/constants'),
            importer = new Importer()

        // classes can't be require-overridden, so monkeypatch
        importer = Object.assign(importer, {
            _getSource(){
                return {
                    profile : {},
                    source : {
                        accessToken : 'some-token',
                        index : null 
                    }
                }
            }
        })

        const exception = await ctx.assert.throws(async() => await importer._readIndices() )
        ctx.assert.includes(exception.public, 'No index found')
    })

})