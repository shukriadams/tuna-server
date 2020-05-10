module.exports = Object.freeze({
    SOURCES_DROPBOX : 'dropbox',
    SOURCES_NEXTCLOUD : 'nextcloud',
    LASTFM : 'lastfm',

    // no specific logic associated with this - logged internally, api exposes as 500, browser logs to console, user gets popunder alert in UI
    ERROR_DEFAULT : 'error_default',

    // thrown when userID is invalid, or user authToken does not exist. Necessitates login.
    ERROR_INVALID_USER_OR_SESSION : 'error_invalid_user_or_session',
    
    // database could not be reached
    ERROR_DATABASE_NOT_AVAILABLE : 'error_database_not_available',

    // user is brute forcing, lock out    
    ERROR_TOO_MANY_ATTEMPTS : 'error_too_many_attempts',

    // user is attempting to perform a function on some external site (dropbox etc), but does not have an integration, or their
    // integration is broken. Regardless, user will have to manually go through oauth flow to add connection.
    ERROR_INVALID_SOURCE_INTEGRATION : 'error_invalid_source_integration',

    // we made an internal stupid by passing an invalid value between functions.
    ERROR_INVALID_ARGUMENT: 'error_invalid_argument',

    // invalid values, likey got through clientside validation(shenanigans likely)
    ERROR_VALIDATION : 'error_validation',

    // profile has timed out after not being email validated
    ERROR_UNCLAIMED_PROFILE : 'error_unclaimed_profile',

    // song does not exist
    ERROR_INVALID_SONG : 'error_invalid_song',

    // attempted to do something thats off limits
    ERROR_PERMISSION_DENIED: 'error_permission_denied',

    // import creation failed because an existing import in progress
    ERROR_IMPORT_IN_PROGRESS : 'error_import_in_progress',
    
    // email not set, cannot send password reset email 
    ERROR_EMAIL_NOT_SET : 'error_email_not_Set',

    // Status of music source connections. common for all connection types. high-level way to flag status for both end user and code system to read and react on
    // Everything's peachy
    SOURCE_CONNECTION_STATUS_WORKING : 'source_connection_status_working',                      

    // Manual oauth flow required by user
    SOURCE_CONNECTION_STATUS_USER_REAUTHORIZE : 'source_connection_status_user_reauthorize'

});