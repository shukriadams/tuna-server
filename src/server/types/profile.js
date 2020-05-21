module.exports = {
    new : function(){
        return {
            id : null,
            // data user was created
            created : null,
            // username, email, whatever the user is pairing with password when logging in
            identifier: null,
            email: null,
            salt : null,
            hash : null, // unique string written each time profile is updated. used to hash it
            passwordResetKey: null,
            isPasswordChangeForced : false,            
            scrobbleToken : null,

            // contents for plugins like lastfm
            plugins : {},

            /*
                objects for music access (dropbox, nextcloud, etc) looking like :

                sources: {
                    dropbox: { },
                    nextcloud: { }
                }

            */

            sources : { }
        }
    }
};
