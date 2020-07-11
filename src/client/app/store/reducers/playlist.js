/**
 *
 */
let defaultSession = {
    // currently loaded playlist
    playlistId : null,
    isDirty : false,
    uuid : null // unique is of state, use this to re-apply current playlist
}

function sessionReducer(state = defaultSession, action) {

    switch (action.type) {

        case 'PLAYLIST_SET': {
            return Object.assign({}, state, {
                playlistId : action.playlistId,
                isDirty: false,
                uuid : new Date().getTime()
            })
        }

        case 'PLAYLIST_DIRTY' : {
            return Object.assign({}, state, {
                isDirty : true
            })
        }

        case 'PLAYLIST_CLEAN' : {
            return Object.assign({}, state, {
                isDirty : false
            })
        }

        case 'PLAYLIST_UNSET': {
            return Object.assign({}, state, {
                playlistId : null,
                isDirty: false,
                uuid : null
            })
        }

        default:{
            return state
        }
    }
}

export default sessionReducer