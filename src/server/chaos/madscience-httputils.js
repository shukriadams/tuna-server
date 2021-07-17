
module.exports = {
    
    binds : [],    
    override : null,
    
    bind(){
        const overrideRequire = require(_$+'lib/require'),
            clonedeep = require('lodash.clonedeep'),
            httpUtils = require('madscience-httputils')

        this.override = clonedeep(httpUtils)
        overrideRequire.add('madscience-httputils', this.override)
        this.override._originalPost = this.override.post
        this.override.post = this.onPost.bind(this)
        
        //this.binds.push({ pattern : /\/v1\/sandbox\/dropbox\/getFile\//, result : { lol : 'lol' }, throw : false, enabled: true })
    },

    async onPost(){
        const url = arguments[0]
        
        for (const bind of this.binds.filter(bind => bind.enabled))
            if (url.match(bind.pattern)){
                if (bind.throw)
                    throw bind.result
                return bind.result
            }
        
        return await this.override._originalPost.apply(this, arguments)
    }

}
