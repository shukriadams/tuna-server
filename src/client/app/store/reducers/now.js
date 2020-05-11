/**
 * Stores ephemeral state of all, switches, modals etc, which are routed through redux but which never persist
 */

 let defaultSession = {
    alert : null,
    showPlayer : true,
    showPlaylistsDialog : false,
    showPlaylistDialog: false,
    playstripFullSize : false
}

function sessionReducer(state = defaultSession, action) {

    switch (action.type) {

        /**
         * Expects standard Tuna API JSON  : 
         *  {
         *      message : string 
         *      error : true|false
         *      type : string (error|default)
         *  }
         */
        case 'NOW_ALERTSET': {
            return Object.assign({}, state, {
                alert : action.alert
            })
        }


        case 'NOW_ALERTCLEAR' : {
            return Object.assign({}, state, {
                alert : null
            })
        }
        
        
        case 'NOW_PLAYSTRIPMODE': {
            return Object.assign({}, state, {
                playstripFullSize : action.playstripFullSize,
                showPlayer : action.showPlayer
            })
        }

        case 'NOW_SHOWPLAYLISTSDIALOG' : {
            return Object.assign({}, state, {
                showPlaylistsDialog : true,
                showPlaylistDialog : false,
            })
        }

        case 'NOW_HIDEPLAYLISTSDIALOG' : {
            return Object.assign({}, state, {
                showPlaylistsDialog : false
            })
        }

        default:{
            return state
        }
    }
}

export default sessionReducer