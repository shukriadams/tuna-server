beforeEach(function(done) {
    (async ()=>{
        const path = require('path')
        global._$ = path.resolve(`${__dirname}/../../../server`) + '/'
        global._$t = path.resolve(`${__dirname}/../`) + '/'

        // we have to force reset all mocks here, this is because mocha isn't atomic and state from one test pollutes another
        const requireMock = require(_$t+'./helpers/require')
        requireMock.clear()

        done()
    })()
})