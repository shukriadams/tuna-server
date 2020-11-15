const clonedeep = require('lodash.clonedeep'),
    assert = require('madscience-node-assert'),
    requireMock = require('./helpers/require')

const injectObject = (path, override)=>{
    const target = require(path),
        clone = clonedeep(target),
        overridden = Object.assign(clone, override)

    requireMock.add(path, overridden)
}

const injectClass = (path, override)=>{
    const target = require(path),
        clone = Object.assign(Object.create(Object.getPrototypeOf(target)), target)

    requireMock.add(path, clone)
}

// suppress logs for all tests
injectObject('winston-wrapper', {
    instance : ()=>{
        return {
            info : {
                info : ()=>{}
            },
            error : {
                error : ()=>{}
            }
        }
    }
})


module.exports = {
    mongoId: '5349b4ddd2781d08c09890f4', // real BSON id for when ObjectID expects to parse the id

    inject : {

        /**
         * Overwrites an object
         */
        object : injectObject,

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