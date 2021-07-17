module.exports = {
    
    /**
     * Throws an error that cannot be rectified by user action. In most cases, this error is a bug or sign of a missing feature, and requires
     * code changes to fix. 
     */
    async unexpectedError(profileId, context, text, eventType, args){
        const Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            eventLog = require(_$+'logic/eventLog')

        // append values intented to use to log data too
        args.profileId = profileId
        args.text = text
        __log.error(args)
        
        text = `${text}. Check log table for details.` 

        const logItem = await eventLog.create(
            profileId,
            eventType,
            context,
            text
        )

        return new Exception({ code : constants.ERROR_EVENTLOG, inner : logItem })
    },


    /**
     * Handles throwing an error that the user can fix by some action at the UI.
     */
    async userError(profileId, context, text, eventType, args){
        const Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            eventLog = require(_$+'logic/eventLog')

        // append values intented to use to log data too
        args.profileId = profileId
        args.text = text
        __log.error(args)
        
        const logItem = await eventLog.create(
            profileId,
            eventType,
            context,
            text
        )

        return new Exception({ code : constants.ERROR_EVENTLOG, inner : logItem })
    }
}