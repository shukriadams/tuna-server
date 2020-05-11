const
    // labels of repeat modes. these are displayed in user interface
    REPEAT_MODE_OFF = 'Off',
    REPEAT_MODE_ALL = 'All',
    REPEAT_MODE_SINGLE = 'Single',

    // array of all modes, for cycling through
    modes = [REPEAT_MODE_OFF, REPEAT_MODE_ALL, REPEAT_MODE_SINGLE]

class RepeatModes {

    default(){
        return REPEAT_MODE_OFF
    }

    // cycles through repeat modes array. can probably be made less complex
    next(currentMode){
        let index = modes.indexOf(currentMode)
        if (index === -1)
            return this.default()

        index ++
        if (index >= modes.length)
            index = 0

        return modes[index]
    }
}

let repeatModes = new RepeatModes()

export {
    repeatModes,
    REPEAT_MODE_OFF,
    REPEAT_MODE_ALL,
    REPEAT_MODE_SINGLE
}
