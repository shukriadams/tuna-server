/**
 * Event log contains system info for user benefit. It can contain both errors and successful events. As history isn't important, the event log is self-cleaned to 
 * prevent overflowing. Events can include :
 * - successful scrobbling to last.fm
 * - import errors
 */
module.exports = {
    new(){
        return {
            profileId : null,   //string
            code : null,        // string. constant. error code.
            context : null,     // string. Summary of text, combined with profileID + code creates compound key constraint to prevent log flooding
            date : null,        // datetime
            text : null         // details of log message. Keep this human-readable.
        }
    }
}