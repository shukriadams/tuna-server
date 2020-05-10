const constants = require(_$+'types/constants')

/**
 * Custom error, all throws in app should be of this type.
 * It has both public and private values, public is for exposing to users, private is for internal logging.
 * 
 * Don't write class/function names in log, stack captures that already.
 * 
 * options : {
 *     code : CONSTANT value of 'ERROR_' type. Exposed to user.
 *     params : string. Some code-useable arg, normally contextual to code. fegs, whene throwing invalid integration error, this will be 'dropbox', so UI knows to redirect to Dropbox oauth flow
 *     inner : existing exception object from try/catch. Internal, logged, never exposed.
 *     log: internal string message to give error some context. Logged, never exposed.
 *     public : string message to expose to user, optional.
 *     forceLog : bool. If true, exception will always be written to logs when reaching API. Use this to log user-oriented errors that should not be happening.
 * }
 */
function Exception(options = {}) {

    /*
    this.message = options.message || 'no message given';
    this.code = options.code;
    this.inner = options;
    // append stack trace
    this.stack = (new Error()).stack;
    */
    this.code = options.code || constants.ERROR_DEFAULT
    this.inner = options.inner || null
    this.log = options.log || ''
    this.public = options.public || ''
    this.forceLog = options.forceLog === undefined ? false : options.forceLog

    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, Exception)
    else
        this.stack = (new Error()).stack
}

Exception.prototype = Object.create(Error.prototype)
Exception.prototype.name = "Exception"
Exception.prototype.constructor = Exception

module.exports = Exception