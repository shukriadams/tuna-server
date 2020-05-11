/**
 * Pubsub is a disconnect event propagator - it binds by string, instead of object.
 */
class Pubsub {

    /**
     *
     */
    constructor() {
        this._subs = {}
        this._whens = {}
        this._eventsFired = {}
    }


    /**
     * Publishes (triggers) an event with the given name.
     * Args is optional.
     */
    pub(eventName, args){
        // fire regular
        let subs = this._subs[eventName]
        if (subs)
            for (let subscriber in subs)
                subs[subscriber](args)

        // fire whens
        subs = this._whens[eventName]
        if (subs){
            for (let subscriber in subs)
                subs[subscriber].callback()

             delete this._whens[eventName]
        }

        // store event for future if's
        this._eventsFired[eventName] = {}
    }


    /**
     * Subscribes to an eventName. The subscription is fired every time the event
     * is triggered.
     *
     * EventNames can be a string or array of strings.
     */
    sub(subscriberName, eventNames, callback){
        if (!subscriberName)
            throw 'pubsub.sub requires subscriberName'

        if (!eventNames)
            throw 'pubsub.sub requires eventNames'

        if (!callback)
            throw 'pubsub.sub requires callback'

        // convert eventNames to array if just one string
        if (typeof eventNames === 'string')
            eventNames = [eventNames]

        for (let eventName of eventNames) {
            let sub = this._subs[eventName]
            if (!sub){
                this._subs[eventName] = {}
                sub = this._subs[eventName]
            }

            sub[subscriberName] = callback
        }
    }


    /**
     *
     */
    unsub(subscriberName, eventNames){
        if (typeof eventNames === 'string')
            eventNames = [eventNames]

        for (let eventName of eventNames) {
            let sub = this._subs[eventName]
            if (!sub)
                continue

            delete this._subs[eventName]
        }
    }


    /**
     * Subscribes to a once-off event. Callback is called when the event fires, or immediately
     * if the event has already fired.
     *
     * Because the given event could have been fired multiple times before being routed,
     * and because we cannot cache event args because of object scope and lifetime issues, args
     * are not passed back for ifs.
     *
     * Optional : if isOnceOff is set to true, the event will be fired once only, then dropped.
     */
    when(subscriberName, eventName, callback){

        // store for next pub
        let sub = this._whens[eventName]
        if (!sub){
            this._whens[eventName] = []
            sub = this._whens[eventName]
        }


        // fire immediately, dont't store callback
        if (this._eventsFired[eventName])
            callback()
        else
            // store callback
            sub[subscriberName] = { callback : callback, called : false} // todo : called is no longer used
    }


    /**
     * For 'when' events, resets an event.
     **/
    reset(eventName){
        if (this._eventsFired[eventName])
            delete this._eventsFired[eventName]

        let sub = this._whens[eventName]
        if (sub){
            for (var subscriberName in sub)
                sub[subscriberName].called = false
        }
    }

}

let instance = new Pubsub()
export default instance