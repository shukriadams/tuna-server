/**
 * In-memory cache. Suitable for private and dev servers. Note that cache contents are flushed every time Node
 * restarts.
 */

let 
    NodeCache = require('node-cache'),
    Exception = require(_$+'types/exception'),
    nodeCache = null

module.exports = {
    initialize(){
        nodeCache = new NodeCache({ stdTTL: 100, checkperiod: 120 })
    },

    async flush(){
        if (!nodeCache)
            return

        nodeCache.flushAll()
        console.log('cache flushed')
    },

    async add (key, object){
        return new Promise((resolve, reject) => {
            try {
                
                if (!nodeCache)
                    return resolve()

                nodeCache.set( key, object,(err)=>{
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
