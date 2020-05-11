/**
 * A class for determining which media query size category the screen is currently in.
 */
class ActiveMediaQuery {

    /**
     * Must be initialized once in page lifespan
     */
    initialize(){
        // don't duplicate element
        if (document.querySelector('.glu_activeMediaQuery') !== null)
            return

        let element = document.createElement('div')
        element.classList.add('glu_activeMediaQuery')
        document.body.appendChild(element)
    }

    /**
     * Gets the current media query size (small|medium|large). Returns null on error or fail, so never assume string content
     */
    get(){
        let element = document.querySelector('.glu_activeMediaQuery')
        if (!element)
            return null

        let size = window.getComputedStyle(
            document.querySelector('.glu_activeMediaQuery'), ':after'
        ).getPropertyValue('content')

        if (size)
            size = size.replace(/"/g, '')

        return size
    }
}

let instance = new ActiveMediaQuery()
export default instance