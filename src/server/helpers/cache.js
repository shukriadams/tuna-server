/**
 * In-memory cache. Suitable for private and dev servers. Note that cache contents are flushed every time Node
 * restarts.
 */
module.exports = {

    _initialize(){
        const NodeCache = require('node-cache')
        return new NodeCache({ stdTTL: 100, checkperiod: 120 })
    },

    async flush(){
        const nodeCache = this._initialize()
        if (!nodeCache)
            return

        nodeCache.flushAll()
    },

    async add (key, object){
        const Exception = require(_$+'types/exception'),
            nodeCache = this._initialize()

        return new Promise((resolve, reject) => {
            try {
                
                if (!nodeCache)
                    return resolve()

                nodeCache.set( key, object, (err)=>{
                    if (err)
                        return reject(new Exception(err))

                    resolve()
                })

            } catch (ex) {
                reject(ex)
            }

        })
    },

    async get (key) {
        const Exception = require(_$+'types/exception'),
            nodeCache = this._initialize()

        return new Promise((resolve, reject) => {

            try {
                if (!nodeCache)
                    return resolve(null)

                nodeCache.get( key, ( err, object )=>{
                    if (err)
                        return reject(new Exception(err))

                    resolve(object)
                })
            } catch(ex) {
                reject(ex)
            }

        })
    },

    async remove(key){
        const Exception = require(_$+'types/exception'),
            nodeCache = this._initialize()

        return new Promise((resolve, reject) => {

            try {
                if (!nodeCache)
                    return resolve()

                nodeCache.del( key, (err)=>{
                    if (err)
                        return reject(new Exception(err))

                    resolve()
                })

            } catch (ex) {
                reject (ex)
            }

        })
    }
}
