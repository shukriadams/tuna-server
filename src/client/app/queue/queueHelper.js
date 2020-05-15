import store from './../store/store'
import { REPEAT_MODE_ALL, REPEAT_MODE_SINGLE } from './../misc/repeatModes'
import songsHelper from './../songs/songsHelper'
import { removeFromQueue } from './../actions/actions'

class QueueHelper {

    isSongInQueue(songId){
        let queuedSongs = store.getState().queue.songs
        return queuedSongs.indexOf(songId) !== -1
    }


    /**
     * Gets array of song ids in queue.
     */
    getQueueSongs(){
        return store.getState().queue.songs
    }


    /**
     *
     */
    isCurrentSong(songId){
        return songId === this.getCurrentSongId() 
    }


    /**
     * Gets the id of the song being auditioned, or if none, the song in the queue.
     */
    getCurrentSongId(){
        let queue = store.getState().queue

        if (queue.auditionedSongId)
            return queue.auditionedSongId

        if (queue.index === null || queue.index >= queue.songs.length)
            return null

        return queue.songs[queue.index]
    }


    /**
     * Gets the current song object being auditioned, or if none, the current song in the queue.
     */
    getCurrentSong(){
        let songId = this.getCurrentSongId()
        if (!songId)
            return null

        return songsHelper.getSong(songId)
    }


    /**
     * Looks for the id of the next song, doesn't change any state. Returns null of no song. Can also be used to see if queue can
     * advance.
     *
     * Does NOT take auditioned songs into account, as these cannot advance.
     *
     * isPassive should be false for a user-driven attempt to advance (forward button
     * press for ex). Passive is driven a song naturally ending and the queue needing to advance.
     *
     * We use isPassive to enable repeat logic (passive only).
     */
    peakNextSongId(isPassive){
        let state =  store.getState(),
            session = state.session,
            queue = state.queue

        if (queue.index === null)
            return null

        let nextSongIndex = queue.index + 1

        // take repeat mode into account
        if (isPassive){
            if (nextSongIndex >= queue.songs.length && session.repeatMode === REPEAT_MODE_ALL)
                nextSongIndex  = 0

            if (session.repeatMode === REPEAT_MODE_SINGLE)
                nextSongIndex  = queue.index
        }

        if (nextSongIndex >= queue.songs.length)
            return null

        return queue.songs[nextSongIndex]
    }

    isQueueEmpty(){
        let state =  store.getState(),
            queue = state.queue

        return queue.songs.length === 0
    }

    /**
     * No active modifier as previous is always active, but never uses repeat mode logic.
     */
    peakPreviousSongId(){
        let state =  store.getState(),
            queue = state.queue

        if (queue.index === null)
            return null

        let nextSongIndex = queue.index - 1
        if (nextSongIndex < 0)
            return null

        return queue.songs[nextSongIndex]
    }


    /**
     * Returns true if queue can advance.
     */
    canQueueAdvance(isPassive){
        return this.peakNextSongId(isPassive) != null
    }


    /**
     * Returns true if queue can retreat
     */
    canQueueRetreat(){
        return this.peakPreviousSongId() != null
    }

    /**
     * Gets object of next song. Like peakeNextSongId, but more computationally expensive.
     */
    peakNextSong(isActive){

        let songId = this.peakNextSongId(isActive)
        if (!songId)
            return null

        return songsHelper.getSong(songId)
    }


    /**
     * Removes orphans from queue. this is a workaround to queue occasionally persisting song ids that
     * are no longer valid
     */
    cleanQueue(){
        let queuedSongs = store.getState().queue.songs
        for (let song of queuedSongs)
            if (!songsHelper.getSong(song))
                removeFromQueue(song)
    }
}

let instance = new QueueHelper()
export default instance
