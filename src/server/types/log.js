/**
 * Log is a general record log that is mostly for debugging. The user is not required to interact with this, no user-interactive
 * events are written here.
 */
module.exports = {
    new : function(){
        return {
            id : null,
            // string or object
            content : null,
            // datetime in milliseoncds log was create at
            date : null,
            // if available, profileid of user log was created for
            profileId : null,
            // optional string to describe entry, often a key or combination of keys to aid in querying data
            context : null
        }
    }
};