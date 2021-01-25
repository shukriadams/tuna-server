/**
 * Contains errors or events that happen in automated processes, and which require the user's immediate attention.
 */
module.exports = {
    new : function(){
        return {
            profileId : null,   //string
            code : null,        // string. constant. error code.
            date : null,
            text : null
        }
    }
};