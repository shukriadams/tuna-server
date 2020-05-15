/**
 * Not persisted. Information about what is currently playing.
 *
 * To play a song, you can either use the queue, or pass in a song directly.
 * queue : add a song to queue. set index of the queue to that song.
 * audition : pass a song in directly by invoking "audition(song)".
 *
 * For the logic on the actual responding to this state, and the final play logic, check player.js. In effect, "playing"
 * is also a kind of queue, it holds only one song.
 */
let defaultState = {

    // this is the master switch for starting play - set to any unique value to play the current song, set to null to stop. stop is not
    // pause, resetting after stopping will restart the current song
    playKey : null,

    // set to true to pause play. setting to false will resume play only if playkey is set
    isPaused : false,

    song: '',       // this can be refactored out, use current song.name
    artist : '',    // refactoro out, use current song.artist
    time: null,     // time played of current song
    duration : null, // total time in current song
    percent : null,
    isPlaying : false, // DO NOT USE THIS, it is unreliable and used in this reducer only. use playerHelper for logic about if a song is currently playing
    jumpToPercent : null, // used to force player to jump to a given percent. only changes to this are responded to
    isDownloading : false, // set to true to inform app that downloading has started. normally a percent change should be used to detect that download is done and play has commernced
    showSongBrowser : false
}


function playingReducer(state = defaultState, action) {
    switch (action.type) {

        case 'PLAY_SHOWSONGBROWSER' : {
            return Object.assign( { }, state, { showSongBrowser: true })
        }

        case 'PLAY_HIDESONGBROWSER' : {
            return Object.assign( { }, state, { showSongBrowser: false })
        }

        // starts play, if not already playing. if playing,
        case 'PLAY_START' : {
            if (state.playKey) // already playing
                return state

            return Object.assign( { }, state, { playKey : new Date().getTime(),  isPaused : false })
        }

        // force the currently playing song to restart
        case 'PLAY_REPLAY' : {
            return Object.assign( { }, state, { playKey : new Date().getTime(),  isPaused : false })
        }

        case 'PLAY_PAUSE' : {
            return Object.assign( { }, state, { isPaused : true })
        }

        case 'PLAY_RESUME' : {
            return Object.assign( { }, state, { isPaused : false })
        }

        case 'PLAY_TICK' : {
            let newState = Object.assign( { }, state, action.playInfo)
            newState.isPlaying = true
            newState.isDownload = false // force false, if ticking we know download is done
            return newState
        }

        case 'PLAY_JUMPTOPERCENT' : {
            return Object.assign( { }, state, { jumpToPercent : action.percent })
        }

        case 'PLAY_DOWNLOADING' : {
            return Object.assign( { }, state, { isDownloading : true })
        }

        case 'PLAY_STOP' : {
            return Object.assign( { }, state, { playKey: null })
        }

        default : {
            // return default state to prevent persisting over page reload
            return state
        }
    }
}

export default playingReducer