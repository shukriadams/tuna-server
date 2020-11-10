beforeEach(function(done) {
    (async ()=>{
        const path = require('path')
        global._$ = path.resolve(`${__dirname}/../../../server`) + '/'

        done()
    })()
})