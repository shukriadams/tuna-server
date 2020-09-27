const path = require('path'),
    clonedeep = require('lodash.clonedeep'),
    assert = require('madscience-node-assert'),
    requireMock = require('./../helpers/require')

global._$ = path.resolve(`${__dirname}/../../server`) + '/'
global._$t = path.resolve(`${__dirname}/../`) + '/'

module.exports = {

    inject : {
        /**
         * Overwrites an object
         */
        object : (path, override)=>{
            const target = require(path),
                clone = clonedeep(target),
                overridden = Object.assign(clone, override)

            requireMock.add(path, overridden)
        },

        /**
         * Overwrites a function
         */
        function : (path, override)=>{
            requireMock.add(path, override)
        }
    },

    requireMock,

    assert
}