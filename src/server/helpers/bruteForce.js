
module.exports = {
    
    /**
     * Processes request - throws exception if brute forcing detected.
     * Has no return type
     */
    async process(options){
        const 
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            timebelt = require('timebelt'),
            cache = require(_$+'helpers/cache'),
            jsonHelper = require(_$+'helpers/json')

        // brute forcing relies on caching to store state
        if (!cache.isEnabled)
            return

        // get cache value
        let ip = options.request.connection.remoteAddress,
            key = `${options.route}_${ip}`
            now = new Date().getTime(),
            createNew = false,
            record = jsonHelper.parse(await cache.get(key))

        // if not value or value expired
        if (!record)
            createNew = true
        // not locked out, last attempt was beyond min attempt window
        else if (!record.lockedOutDate && timebelt.minutesDifference(now, record.date) > options.period)
            createNew = true
        // locked out, but lockout has exceeded cooldown and therefore expired
        else if (record.lockedOutDate && timebelt.minutesDifference(now, record.lockedOutDate) > options.cooldown)
            createNew = true


        // if value and value expired, reset, log and return
        if (createNew){
            await cache.add(key, JSON.stringify({
                date : now,
                attempts : 1,
                isLockedOut : false,
                lockedOutDate : null
            }))

            return 
        }


        if (record.isLockedOut)
            throw new Exception({ code : constants.ERROR_TOO_MANY_ATTEMPTS })

        record.attempts ++
        if (record.attempts >= options.threshold){
            record.isLockedOut = true
            record.lockedOutDate = now
        }

        await cache.add(key, JSON.stringify(record))
    },

    async clear(options){
        const 
            cache = require(_$+'helpers/cache'),
            ip = options.request.connection.remoteAddress,
            key = `${options.route}_${ip}`

        await cache.remove(key)
    }
}

