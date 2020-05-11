/**
 * Adds an animate class to a dom element, calls callback after timeout, then remove animate class.
 * Use for trivial animations
 */
export default function animator(elements, animationClass, timeout, callback){
    if (!Array.isArray(elements)) 
        elements = [elements]

    for (let element of elements)
        element.classList.add(animationClass)

    setTimeout(function(){
        if (callback)
            callback()

        for (let element of elements)
            element.classList.remove(animationClass)

    }, timeout)
}