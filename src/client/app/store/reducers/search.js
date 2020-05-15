let defaultSession = {
    search : null
}

function sessionReducer(state = defaultSession, action) {

    switch (action.type) {

        case 'SEARCH_CHANGED': {
            return Object.assign({}, state, { search : action.search  })
        }

        default:{
            return state
        }
    }
}

export default sessionReducer