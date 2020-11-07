const subscribers = {}

/**
 * key : unique name of call point
 * waitTime : time in milliseconds to elapse between calls
 * callback : work function
 */
module.exports = { 
    async debounce (key, waitTime, callback){
        
        const now = new Date().getTime()

        // call callback if is it not logged or its allowed wait time has elpased, else log time and wait
        if (!subscribers[key] || now - subscribers[key] > waitTime){
            await callback()
            subscribers[key] = now
        }
    }
}