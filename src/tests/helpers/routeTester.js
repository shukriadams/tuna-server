const requireMock = require(_$t+'helpers/require')

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

                // normally used to retrieve headers
                get(headername){
                    return 'some-header'
                },

                header(item){
                    return this.headers[item]
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
        this.req.headers.Authorization = `bearer ${token}`
        // authHelper needs to find an authToken record for auth to pass
        this.authToken = { id : 'placeholder-tokenId', profileId : 'placeholder-profileId' }
        
        // override authHelper to approve authentication
        const authTokenLogic = require(_$+'logic/authToken')
        authTokenLogic.getById =()=>{ return this.authToken }
        requireMock.add(_$+'logic/authToken', authTokenLogic)
    }

    setUserContent(userContent){
        if (!this.route)
            throw 'route not bound yet';

        // need to override both profilelogic and content helper as they can both be used to generated content
        const profileLogic = require(_$+'logic/profiles'),
            contentHelper = require(_$+'helpers/content')

        contentHelper.build = ()=>{ return userContent }
        requireMock.add(_$+'helpers/content', contentHelper)

        profileLogic.buildUserContent =()=>{ return userContent }
        requireMock.add(_$+'logic/profiles', profileLogic)
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