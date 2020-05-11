class NoScroll {

    constructor(){

         let elements = document.getElementsByTagName('body');
         if (!elements.length || elements.length > 1)
            return console.log(`glu_noScroll found an invalid number of body elements : ${elements.length}`);

         this.body = elements[0];
    }

    lock (){
        this.body.classList.add('glu_noScroll--locked');
    }

    unlock(){
        this.body.classList.remove('glu_noScroll--locked');
    }

    toggle(isLocked){
        if (isLocked)
            this.lock();
        else
            this.unlock();
    }

}

const instance = new NoScroll();

export default instance;