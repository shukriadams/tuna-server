export default class KeyWatcher {

    /**
     *  options.onDown      : optional callback function, triggered when key goes from up to down
     *  options.onChange    : optional callback function, triggered when key state changed
     *  options.onUp        : optional callback function, triggered when key goes from down to up
     *  options.key         : keyboard code for key, egs 'Shift' is shift key
     **/
    constructor(options) { // put in defaults here
        this.isDown = false
        
        this.keydownHandler = e => {
            if (e.key !== options.key || this.isDown)
                return

            this.isDown = true

            if (options.onDown)
                options.onDown(this)

            if (options.onChange)
                options.onChange(this)
        }

        this.keyupHandler = e => {
            if (e.key !== options.key || !this.isDown)
                return

            this.isDown = false

            if (options.onUp)
                options.onUp(this)

            if (options.onChange)
                options.onChange(this)
        }

        window.addEventListener('keydown',this.keydownHandler, false)
        window.addEventListener('keyup', this.keyupHandler, false)
    }

    dispose(){
        window.removeEventListener('keydown',this.keydownHandler, false)
        window.removeEventListener('keyup', this.keyupHandler, false)
    }
}