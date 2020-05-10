class ExpressShim{
    
    constructor(){
        this.capturedRoutes = {};
    }

    // mimics express 'get' 
    get (routeDefinition, routeHandler){
        this.capturedRoutes[`GET ${routeDefinition}`] = routeHandler;
    }

    // mimics express 'post' 
    post (routeDefinition, routeHandler){
        this.capturedRoutes[`POST ${routeDefinition}`] = routeHandler;
    }

    // mimics express 'delete' 
    delete (routeDefinition, routeHandler){
        this.capturedRoutes[`DELETE ${routeDefinition}`] = routeHandler;
    }

    // mimics express 'put' 
    put (routeDefinition, routeHandler){
        this.capturedRoutes[`PUT ${routeDefinition}`] = routeHandler;
    }
}

module.exports = class RouteTester{

    constructor(route) {
        return (async () => {
            this.req = {
                body : {},
                query : {},
                params: {},
                headers: {},
                header(item){
                    return this.headers[item];
                }
            }

            // if user is logged in, this will be set a valid token { id : 'placeholder', profileId : 'placeholder' }
            this.authToken = null; 

            this.res = {
                sent : null,
                status : null,
                redirected: null,
                content: null,

                send(content){
                    this.content = content;
                },
                redirect(r){
                    this.redirected = r;
                },
                status(s){
                    this.status = s;
                },
                json(content){
                    this.content = content;
                }
            }
    
            // always clone tested structures so our test monkeypatching doesn't pollute the source,
            // mocha does not isolate tests
            this.route = Object.assign({}, route);
            this.express = new ExpressShim(this);
            await this.route.bind(this.express);

            return this; 
        })();
    }
    
    authenticate(token = 'placeholder'){
        if (!this.route.authHelper)
            throw 'Route does not expose authHelper - cannot shim authenticate on it';

        this.req.headers.Authorization = `bearer ${token}`;
        // authHelper needs to find an authToken record for auth to pass
        this.authToken = { id : 'placeholder-tokenId', profileId : 'placeholder-profileId' };
        this.route.authHelper.authTokenLogic.getById =()=>{ return this.authToken };
    }

    setUserContent(userContent){
        if (!this.route)
            throw 'route not bound yet';

        if (!this.route.profileLogic)
            throw 'route must expose profileLogic for userContent setting to work';

        this.route.profileLogic.buildUserContent =()=>{ return userContent };
    }

    async get(routePattern){
        await this.execute(`GET ${routePattern}`);
    }

    async post(routePattern){
        await this.execute(`POST ${routePattern}`);
    }

    async delete(routePattern){
        await this.execute(`DELETE ${routePattern}`);
    }

    async put(routePattern){
        await this.execute(`PUT ${routePattern}`);
    }

    async execute(routePattern){
        if (!this.express.capturedRoutes[routePattern])
            throw `route pattern ${routePattern} has not been captured`;

        await this.express.capturedRoutes[routePattern](this.req, this.res);
    }

};