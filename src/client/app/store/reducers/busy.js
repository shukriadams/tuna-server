function busy(state = null, action) {

    switch (action.type) {

        case 'BUSY': {
            return action.message;
        }

        case 'NOT_BUSY': {
            return null;
        }

        default: {
            return state;
        }
    }
}

export default busy