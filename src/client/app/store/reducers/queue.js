/**
 * Queue is the list of songs which will be played. Songs can be added, removed, and the order can be changed. 
 * The queue contents are rendered as the "playlist"
 */

import { REPEAT_MODE_OFF, REPEAT_MODE_ALL, REPEAT_MODE_SINGLE } from './../../misc/repeatModes'

const defaultState = {
    songs: [], //array of song ids to play
    auditionedSongId : null, // song id to audition. will be played instead of the next song in queue
    index : null
}

// calculates best index after songs change
function getIndex(newState){

    // index hasn't been set ? start at if there are songs
    if (newState.index === null && newState.songs.length)
        return 0

    // index has been set but falls outside of allowed range - set to last song
    if (newState.index !== null && newState.index >= newState.songs.length)
        return newState.songs.length -1

    return newState.index
}

function queueReducer(state = defaultState, action) {

    switch (action.type) {

        // fully overwrite the queue with some songs
        case 'SET_TO_QUEUE' : {
            let newState = Object.assign({}, state, { songs : action.songIds })
            newState.index = 0 // when completely changing queue with new songs, always reset queue to start position
            return newState
        }

        // adds to songs to END of queue, does not affect current index
        case 'ADD_TO_QUEUE': {
            let incomingSongIds = action.songIds
            if (typeof(incomingSongIds) === 'string')
                incomingSongIds = [incomingSongIds]

            let songs = state.songs.slice(0) // clone array
            for (let songId of incomingSongIds)
                if (!songs.includes(songId))
                    songs.push(songId)

            let newState = Object.assign({}, state, { songs : songs })
            newState.index = getIndex(newState)
            return newState
        }

        case 'REMOVE_FROM_QUEUE': {
            let outgoingSongs = action.songIds,
                currentlyFocusedSong = state.index && state.index < state.songs.length ? state.songs[state.index] : null,
                currentFocusedSongWasRemoved = false

            if (typeof(outgoingSongs) === 'string')
                outgoingSongs = [outgoingSongs]

            let songs = state.songs.slice(0), // clone array
                indexOfFirstRemoveSong = songs.indexOf (outgoingSongs[0])

            for (let songId of outgoingSongs){
                let indexInQueue = songs.indexOf (songId)
                if (indexInQueue === -1)
                    continue

                if (songId === currentlyFocusedSong)
                    currentFocusedSongWasRemoved = true

                songs.splice(indexInQueue, 1)
            }

            let newFocusedIndex = state.index
            if (currentlyFocusedSong){
                if (currentFocusedSongWasRemoved){
                    // the current song was removed, we want to set index to the first song after the block that was
                    // removed. If that puts us out of the queue range, stay at the end of the queue.
                    if (indexOfFirstRemoveSong + 1 < songs.length)
                        newFocusedIndex = indexOfFirstRemoveSong + 1
                    else if (songs.length)
                        newFocusedIndex = songs.length - 1

                } else {
                    // current song is still in queue, but songs before it were deleted and index now points
                    // to a song that's further ahead - force index back to the song, using its id
                    if (songs.indexOf(currentlyFocusedSong) !== state.index)
                        newFocusedIndex = songs.indexOf(currentlyFocusedSong)
                }
            }

            let newState = Object.assign({}, state, { songs : songs })
            newState.index = newFocusedIndex
            return newState
        }

        case 'CLEAR_QUEUE': {
            return Object.assign({}, state, defaultState )
        }

        case 'FOCUS_SONG_IN_QUEUE': {
            let indexInQueue = state.songs.indexOf (action.songId)
            if (indexInQueue === -1)
                return state

            return Object.assign({}, state, { index : indexInQueue, auditionedSongId : null })
        }

        case 'QUEUE_BACK' : {
            let index = state.index - 1

            if (index < 0) {
                if (action.repeatMode === REPEAT_MODE_ALL)
                    index = state.songs.length - 1
                else
                    index = 0
            }

            return Object.assign({}, state, { index : index , auditionedSongId : null })
        }

        case 'QUEUE_FORWARD': {
            // first of all, advance the index
            let index = state.index + 1

            // if reach end of queue and not repeating, leave state unchanged
            if (action.repeatMode === REPEAT_MODE_OFF && index >= state.songs.length)
                return state

            // we're repeating one song, roll back the advance
            if (action.repeatMode === REPEAT_MODE_SINGLE && action.isPassive)
                index --

            // we're repeating everything, and have run out of queue, start from 0
            if (action.repeatMode === REPEAT_MODE_ALL && index >= state.songs.length)
                index = 0

            return Object.assign({}, state, { index : index, auditionedSongId : null })
        }

        case 'QUEUE_MOVE_SONGS': {
            let activeSong = null,
                songs = state.songs.slice(0) // clone array

            if (state.index !== null)
                activeSong = songs[state.index]

            for (let songId of action.songIds){

                let songPosition = songs.indexOf(songId)
                if (songPosition === -1)
                    continue

                // remove song from list
                let item = songs.splice(songPosition, 1)[0]

                if (songPosition < action.position)
                    action.position --

                // add song back to list at new position
                songs.splice(action.position, 0, item)
            }

            // update index to be whatever the active song's new position is
            let index = songs.findIndex(song => song.id === activeSong.id)

            return Object.assign({}, state, { songs, index })
        }

        /**
         * Pass in a song id directly to play it. Ignores the queue. When the song finishes (and mode is not repeat)
         * the next song in the queue will play.
         */
        case 'QUEUE_AUDITION': {
            return Object.assign({}, state, { auditionedSongId : action.songId })
        }

        default: {
            // return default state to prevent persisting over page reload
            return state
        }
    }
}

export default queueReducer