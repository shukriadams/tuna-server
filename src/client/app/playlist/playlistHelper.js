import store from './../store/store'

export default {
    getById : function(id){
        let session = store.getState().session
        if (!session.playlists)
            return null

        return session.playlists.find((playlist)=> {
            return playlist.id === id
        })
    },

    createNew : function(){
        return {
            name : 'New Playlist'
        }
    }
}