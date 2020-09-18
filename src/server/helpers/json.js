/**
 * Common JSON logic for server-side
 */
const constants = require(_$+'types/constants'),
    JsonStreamStringify = require('json-stream-stringify'),
    errorBehaviourMap = {}

errorBehaviourMap[constants.ERROR_DEFAULT] = { status : 500, log : true }
errorBehaviourMap[constants.ERROR_INVALID_USER_OR_SESSION] = { status : 401, log : false, public : 'Invalid user/session. Please relog' }
errorBehaviourMap[constants.ERROR_TOO_MANY_ATTEMPTS] = { status : 401, log : false, public : 'Too many attempts, please wait' }
errorBehaviourMap[constants.ERROR_INVALID_SOURCE_INTEGRATION] = { status : 400, log : false, public : 'Music source integration error - redo oauth' }
errorBehaviourMap[constants.ERROR_INVALID_ARGUMENT] = { status : 500, log : true }
errorBehaviourMap[constants.ERROR_VALIDATION] = { status : 400, log : false, public : 'Validation error' }
errorBehaviourMap[constants.ERROR_UNCLAIMED_PROFILE] = { status : 401, log : false }
errorBehaviourMap[constants.ERROR_INVALID_SONG] = { status : 401, log : false, public : 'Invalid song' }
errorBehaviourMap[constants.ERROR_PERMISSION_DENIED] = { status : 403, log : false, public : 'You don\'t have pemission to do that' }
errorBehaviourMap[constants.ERROR_IMPORT_IN_PROGRESS] = { status : 400, log : false, public : 'Import already in progress' }


module.exports = {

    /**
     * Returns "success" result in form of standard Tuna API result, which is always { code, message, payload }
     * 
     * Code is always error code. If no error has occurred, code will be null.
     * 
     * Message is some error text which the user must always see. If no error has occurred, message will be null.
     * 
     * Payload is some object which we want from the API. It could be empty, a string, or complex expected data, 
     * or some kind of detailed error description, but in that case .code will still be set to some value.
     */
    returnPayload(res, payload = {}){
        /*
        res.send({
            code : null,
            message: null,
            payload : payload
        })
        */
       
       res.type('json')
       new JsonStreamStringify({
            code : null,
            message: null,
            payload : payload
        }).pipe(res)
        
    },
   

    /**
     * Returns "error" result in form of standard Tuna API result, which is always { code, message, payload }
     * All errors must be routed through here - errors which bypass should be handled as fatal server errors by the client
     */
    returnException(res, ex){
        const 
            constants = require(_$+'types/constants'),
            settings = require(_$+'helpers/settings'),
            logger = require('winston-wrapper').instance(settings.logPath),
            // get some behaviour based on exception code. Don't assume code has been set.
            behaviour = errorBehaviourMap[ex.code || '--'] || errorBehaviourMap[constants.ERROR_DEFAULT]

        // most logging happens here - errors that happen deep in the application stack are thrown as Exception and should always
        // bubble up to API interface, which ends up in this JSON helper, where we decide logging and how to inform client.
        if (behaviour.log || ex.forceLog)
            logger.error.error(ex)
    
        res.status(behaviour.status)
        res.json({
            payload : null,
            message : ex.public || behaviour.public || 'An unexpected error occurred',
            code : ex.code || constants.ERROR_DEFAULT
        })
    },


    /**
     * Safe parse wrapper for json.parse, throws meaningful exception in event of parse error, instead of Node's useless default
     * "invalid token at position 1".
     * 
     * ALL server-side JSON.parse should be replaced with this
     */
    parse (raw){
        const Exception = require(_$+'types/exception')

        try {
            return JSON.parse(raw)
        }catch (ex){
            throw new Exception({
                code : constants.ERROR_INVALID_ARGUMENT,
                log : 'invalid JSON string',
                inner : {
                    ex,
                    raw : raw ? raw.substring(0, 1000) : 'raw was null' // return only first 1000 chars of invalid json, if it's longer than this we don't care
                }
            })
        }
    }

}
