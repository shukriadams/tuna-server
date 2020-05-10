module.exports = {
    new : function(){
        return {
            id : null,
            created : null,
            expires : null,
            // normally unique browser id of some kind. for now, it's generated in-app
            context : null,
            userAgent : null,
            profileId : null
        }
    }
};