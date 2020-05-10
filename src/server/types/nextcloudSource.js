module.exports = {
    new : function(){
        return {
            
            accessToken : null,

            // token to acquire new access token
            refreshToken : null,

            // access token expirty time (in seconds)
            expiresIn : 0,

            // username of nextcloud account linked to
            userId : null,

            // MILLISECONDS
            tokenDate : null,

            /**
             * Array of .tuna.xml index files found 
             * {
             *     id : 1234                    (nextcloud file integer file)
             *     path: /test/.tuna.xml    (nextcloud file path, )
             *     readDate: 123454544344       (milliseconds, date file content was read and music imported from it.)    
             *     status: ''                   (string, enduser-readable. result of import. 'success' | 'not a valid index file' | 'no songs found' etc)
             * }
             */
            indexes : [],

            // date indexes last imported. MILLISECONDS. Nullable. If this value set but .indexes array is empty, we can tell user they have not indexed their music
            indexImportDate : null,

            // hash of the current index file. used to quickly determine if index file has changed, and should be auto-imported
            indexHash: null,

            // enumerator from constants.SOURCE_CONNECTION_STATUS_*
            status : null

        }
    }
};