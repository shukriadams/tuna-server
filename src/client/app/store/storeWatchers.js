/**
 * Contains global logic based on changes to the store - this is typically when one action needs to be called after
 * some other action has fired.
 */
import store from './store'
import watch from 'redux-watch'
import playlistHelper from './../playlist/playlistHelper'
import songsHelper from './../songs/songsHelper'
import BlobStore from './../blobStore/blobStore'
import { playStop, clearQueue, playlistUnset, setQueue, playlistDirty, removeFromQueue } from '../actions/actions'

export default function(){


    /**
     *
     */
    store.subscribe(watch(store.getState, 'queue.songs')(function(songs) {

        // if queue is empty, force play stop
        if (!songs.length)
            playStop()

        // If songs are loaded into the queue, and a playlist is loaded, compare queue to playlist songs, and mark as dirty if they differ.
        // Note that this event is fired after a playlist is set when the playlist's songs are loaded, so loading
        // a playlist can mark itself as dirty if don't check
        let loadedPlaylistId = store.getState().playlist.playlistId

        if (loadedPlaylistId){
            let loadedPlaylist = playlistHelper.getById(loadedPlaylistId)
            if (loadedPlaylist && !songsHelper.areListsEqual(songs, loadedPlaylist.songs))
                playlistDirty()
        }
    }))


    /**
     *
     */
    store.subscribe(watch(store.getState, 'session.token')(async(token)=>{
        if (token)
            return

        // user logged out, clean stuff up
        let blobStore = new BlobStore()
        await blobStore.clearAsync()
        playlistUnset()
        clearQueue()

    }))


    /**
     * Watch for changes in current playlist
     */
    store.subscribe(watch(store.getState, 'playlist.uuid')(function() {
        let playlistId = store.getState().playlist.playlistId,
            playlist = playlistHelper.getById(playlistId)

        if (!playlist)
            return

        setQueue(playlist.songs)
    }))

    // songs have been changed - enforce integrity of queue and playlists
    store.subscribe(watch(store.getState, 'session.songs')(function(songs) {
        // check queue
        let queueSongs =  store.getState().queue.songs,
            removeSongs = []

        for (let queueSong of queueSongs)
            if(!songs.find(function(song){ return song.id === queueSong; }))
                removeSongs.push(queueSong)

        removeFromQueue(removeSongs)
    }))

}