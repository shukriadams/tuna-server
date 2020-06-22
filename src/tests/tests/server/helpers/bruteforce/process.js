const constants = require(_$+'types/constants'),
    mocha = require(_$t+'helpers/testbase')

mocha('helpers/bruteforce/process', function(ctx){

    it('helpers/bruteforce/process::happy    unprocessed call', async () => {
        let result
       
        ctx.inject.object(_$+'helpers/cache', {
            isEnabled : true,
            // return null for a hitherto unprocessed key
            get (){ 
                return null
            },add(key, json){
                result = JSON.parse(json)
            } 
        })

        const bruteforce = require(_$+'helpers/bruteForce'),
            options = {
                request : {
                    connection : {
                        remoteAddress : 'my-ip'
                    }
                }
            }

        await bruteforce.process(options)
        // new bruteforce record was created
        ctx.assert.equal(result.attempts, 1)
        ctx.assert.false(result.isLockedOut)
    })




    it('helpers/bruteforce/process::happy    entry has expired', async () => {
        let result
        ctx.inject.object(_$+'helpers/cache', {
            isEnabled : true,
            // return record, but set its date far back for it to have timed out
            get (){ 
                return JSON.stringify({
                    date : new Date('2000-1-1'),
                    attempts : 8,
                    isLockedOut : false,
                    lockedOutDate : null
                })
            },add(key, json){
                result = JSON.parse(json)
            } 
        })

        const bruteforce = require(_$+'helpers/bruteForce'),
            options = {
                period: 10,
                request : {
                    connection : {
                        remoteAddress : 'my-ip'
                    }
                }
            }

        await bruteforce.process(options)
        // new bruteforce record was created
        ctx.assert.equal(result.attempts, 1)
        ctx.assert.false(result.isLockedOut)
    })



    it('helpers/bruteforce/process::happy    lockout has expired', async () => {
        let result
        ctx.inject.object(_$+'helpers/cache', {
            isEnabled : true,
            // return record, set it to locked out, but set its date far back for it to have expired
            get (){ 
                return JSON.stringify({
                    date : new Date('2000-1-1'),
                    attempts : 8,
                    isLockedOut : true,
                    lockedOutDate : new Date('2000-1-1'),
                })
            },add(key, json){
                result = JSON.parse(json)
            } 
        })

        const bruteforce = require(_$+'helpers/bruteForce'),
            options = {
                period: 10,
                cooldown: 10,
                threshold: 10,
                request : {
                    connection : {
                        remoteAddress : 'my-ip'
                    }
                }
            }

        await bruteforce.process(options)
        // new bruteforce record was created
        ctx.assert.equal(result.attempts, 1)
        ctx.assert.false(result.isLockedOut)
    })




    it('helpers/bruteforce/process::happy    tally up, threshhold exceeded', async () => {
        let result
        ctx.inject.object(_$+'helpers/cache', {
            isEnabled : true,
            // return record, set its date to current
            get (){ 
                return JSON.stringify({
                    date : new Date(),
                    attempts : 9,
                    isLockedOut : false,
                    lockedOutDate : null
                })
            },add(key, json){
                result = JSON.parse(json)
            } 
        })

        const bruteforce = require(_$+'helpers/bruteForce'),
            options = {
                period: 10,
                cooldown: 10,
                threshold: 10,
                request : {
                    connection : {
                        remoteAddress : 'my-ip'
                    }
                }
            }

        await bruteforce.process(options)
        // lockout now in effect
        ctx.assert.equal(result.attempts, 10)
        ctx.assert.true(result.isLockedOut)
        ctx.assert.notNull(result.lockedOutDate)
    })




    it('helpers/bruteforce/process::happy    tally up, threshhold not exceeded', async () => {
        let result
        ctx.inject.object(_$+'helpers/cache', {
            isEnabled : true,
            // return record, set its date to current
            get (){ 
                return JSON.stringify({
                    date : new Date(),
                    attempts : 8,
                    isLockedOut : false,
                    lockedOutDate : null
                })
            },add(key, json){
                result = JSON.parse(json)
            } 
        })

        const bruteforce = require(_$+'helpers/bruteForce'),
            options = {
                period: 10,
                cooldown: 10,
                threshold: 10,
                request : {
                    connection : {
                        remoteAddress : 'my-ip'
                    }
                }
            }

        await bruteforce.process(options)
        // attempt tallies up, still not locked out
        ctx.assert.equal(result.attempts, 9)
        ctx.assert.false(result.isLockedOut)
    })




    it('helpers/bruteforce/process::unhappy    lockout in effect', async () => {
        let result
        ctx.inject.object(_$+'helpers/cache', {
            isEnabled : true,
            // return record, set it to locked out, set date to now so lockout is still active
            get (){ 
                return JSON.stringify({
                    date : new Date('2000-1-1'),
                    attempts : 8,
                    isLockedOut : true,
                    lockedOutDate : new Date,
                })
            },add(key, json){
                result = JSON.parse(json)
            } 
        })

        const bruteforce = require(_$+'helpers/bruteForce'),
            options = {
                period: 10,
                cooldown: 10,
                request : {
                    connection : {
                        remoteAddress : 'my-ip'
                    }
                }
            }

        const exception = await ctx.assert.throws(async () => await bruteforce.process(options) )
        // lockout exception was thrown
        ctx.assert.equal(exception.code, constants.ERROR_TOO_MANY_ATTEMPTS)
    })
    
})

