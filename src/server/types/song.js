module.exports = {
    new : function(){
        return {
            id : null,
            name : null,
            nameKey : null,
            updated: null, // ticks
            imported : null, // ticks
            extension : null,
            artist : null,
            album : null,
            plays : null,
            size : null,
            path : null,
            lastPlayed: null,
            srcLastChanged : null,
            duration : null,
            profileId : null,
            tags : []
        }
    }
};