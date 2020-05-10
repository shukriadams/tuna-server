const 
    Exception = require(_$+'types/exception'),
    constants = require(_$+'types/constants'),
    timebelt = require('timebelt'),
    cache = require(_$+'helpers/cache'),
    jsonHelper = require(_$+'helpers/json')

module.exports = {
    async process(options){
        if (!cache.isEnabled)
            return

        let ip = options.request.connection.remoteAddress,
            key = `${options.route}_${ip}`

        // get cache value
        let now = new Date().getTime(),
            record = jsonHelper.parse(await cache.get(key))

        // if not value or value expired
        let createNew = false
        if (!record)
            createNew = true

        else if (!record.lockedOutDate && timebelt.minutesDifference(now, record.date) > options.period)
            createNew = true

        else if (record.lockedOutDate && timebelt.minutesDifference(now, record.lockedOutDate) > options.cooldown)
            createNew = true

        if (createNew)
            return await cache.add(key, JSON.stringify({
                date : now,
                attempts : 1,
                isLockedOut : false,
                lockedOutDate : null
            }))

        // if value and value expired, reset, log and return
        if (record.isLockedOut)
            throw new Exception({ code : constants.ERROR_TOO_MANY_ATTEMPTS })

        record.attempts ++
        if (record.attempts > options.threshold){
            record.isLockedOut = true
            record.lockedOutDate = now
        }

        await cache.add(key, JSON.stringify(record))
    },

    async clear(options){
        let ip = options.request.connection.remoteAddress,
            key = `${options.route}_${ip}`

        await cache.remove(key)
    }
}

