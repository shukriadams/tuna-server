import { repeatModes } from './../../misc/repeatModes'

let defaultSession = {
    token : null,
    volume : 50,
    songs : [],
    songsHash : null,
    playlists : [], // can be array
    repeatMode : repeatModes.default()
}

function sessionReducer(state = defaultSession, action) {

    switch (action.type) {

        case 'SESSION_SETPLAYLISTS' : {
            return Object.assign({}, state, {
                playlists : action.playlists
            })
        }

        case 'SESSION_SETVOLUME' : {
            return Object.assign({}, state, {
                volume : action.volume
            })
        }

        case 'NEXT_REPEAT_MODE' : {
            return Object.assign({}, state, {
                repeatMode : repeatModes.next(state.repeatMode)
            })
        }

        case 'SESSION_SET' : {
            return Object.assign({}, state, action.session)
        }

        case 'CLEAR_SESSION' : {
            return defaultSession
        }

        case 'SET_SONGS' : {
            return Object.assign({}, state, { 
                songs : action.songs.songs, 
                songsHash : action.songs.hash 
            })
        }

        case 'REMOVE_LASTFM' : {
            return Object.assign({}, state, { isScrobbling : false })
        }

        case 'SESSION_FLAGRELOAD' : {
            return Object.assign({}, state, { forceRefreshOnNextLoad : true })
        }

        default : {
            return state
        }
    }
}

export default sessionReducer