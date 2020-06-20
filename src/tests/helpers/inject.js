const requireMock = require(_$t+'helpers/require'),
    clonedeep = require('lodash.clonedeep')

module.exports = {
    /**
     * Overrides a module object at the given path
     */
    object : (path, override)=>{
        const target = require(path)
        //let overridden = JSON.parse(JSON.stringify(target)) //Object.assign(target, override)
        const clone = clonedeep(target)
        const overridden = Object.assign(clone, override)
        requireMock.add(path, overridden)
    }
} 