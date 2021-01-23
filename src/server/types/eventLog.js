/**
 * Contains errors or events that happen in automated processes, and which require the user's immediate attention.
 */
module.exports = {
    new : function(){
        return {
            profileId : null,   //string
            type : null,        //string
            date : null,
            text : null
        }
    }
};