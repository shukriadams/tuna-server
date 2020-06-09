const
    process = require('process'),
    Mocha = require('mocha'),
    glob = require('glob'),
    tests = glob.sync('./tests/**/*.js'),
    argv = require('minimist')(process.argv.slice(2)),
    mocha = new Mocha({ 
        fgrep : argv._.length ? argv._[0] : '' // npm run testdebug "test name" to run a single test, test name is from it("I am a test name") 
    });

process.env['IGNORE_DEV_ENV'] = true

// import testbase to activate global root variables
require('./helpers/testbase')

for (let i = 0 ; i < tests.length ; i ++){
    // slice removes .js file extension, which mocha doesn't want
    mocha.addFile(tests[i].slice(0, -3))
}

mocha.addFile('/vagrant/src/tests/simple')

mocha.run( )