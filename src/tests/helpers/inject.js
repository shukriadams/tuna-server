const requireMock = require(_$t+'helpers/require')

module.exports = {
    /**
     * Overrides a module object at the given path
     */
    object : (path, override)=>{
        let target = require(path)
        target = Object.assign(target, override)
        requireMock.add(path, target)
    }
} 