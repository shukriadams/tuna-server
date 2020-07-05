module.exports = {
    new : function(){
        return {
            
            accessToken : null,

            /**
             * Array of tuna.dat index files found 
             * {
             *     id : 1234                    (nextcloud file integer file)
             *     path: /test/.tuna.dat        (nextcloud file path, )
             *     readDate: 123454544344       (milliseconds, date file content was read and music imported from it.)    
             *     status: ''                   (string, enduser-readable. result of import. 'success' | 'not a valid index file' | 'no songs found' etc)
             * }
             */
            indexes : [],

            // date indexes last imported. MILLISECONDS. Nullable. If this value set but .indexes array is empty, we can tell user they have not indexed their music
            indexImportDate : null,

            // enumerator from constants.SOURCE_CONNECTION_STATUS_*
            status : null,

            // hash of the current index file. used to quickly determine if index file has changed, and should be auto-imported
            indexHash: null,
        }
    }
};