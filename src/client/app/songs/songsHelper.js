import store from './../store/store'

export default {

    /**
     * Gets a song by id
     */
    getSong : (songId) =>{
        let songs = store.getState().session.songs
        return songs.find( song => song.id === songId )
    },


    /**
     * Converts an array of song ids into song objects
     */
    idsToObjects(ids){
        let songs = []
        for (let id of ids){
            let song = this.getSong(id)
            if (song)
                songs.push(song)
        }

        return songs
    },


    /**
     * Utility function for javascript arrays - sorts objects that have a "name" property
     **/
    sort (a, b) {
        let aName = a.name.toLowerCase(),
            bName = b.name.toLowerCase()

        if (aName < bName)
            return -1

        if (aName > bName)
            return 1

        return 0
    },


    /**
     * Compares two arrays of songs or song ids, returns true if the list contain the same songs in the same order
     */
    areListsEqual(list1, list2){
        if (list1.length !== list2.length)
            return false

        for (let i = 0 ; i < list1.length ; i ++){
            if (typeof(list1[i]) === 'string'){
                if (list1[i] !== list2[i])
                    return false
            }
            else if (list1[i].id !== list2[i].id)
                return false
        }

        return true
    }
}
