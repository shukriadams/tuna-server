/**
 * Log of music played. Will be used for stats. currently not used.
 */
module.exports = {
    new : function(){
        return {
            profileId : null,
            songId : null,
            artist : null,
            album : null,
            name : null,
            date : null
        }
    }
};