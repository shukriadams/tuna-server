/**
 * Helper for express routes, returns an authToken record if the route call has the correct header on it, 
 * throws an exception if it doesn't.
 */
const
    Exception = require(_$+'types/exception'),
    constants = require(_$+'types/constants'),
    authTokenLogic = require(_$+'logic/authToken')

module.exports = { 
    
    authTokenLogic,
    
    /**
     * Authenticates assuming bearer token in header
     */
    async authenticate(req){
        let token = req.header('Authorization')
        if (token){
            token = token.trim()
            let matches = token.match(/bearer (.*)/i)
            if (matches && matches.length === 2)
                token = matches.pop()
        }

        return await this.authenticateTokenString(token)
    },

    /**
     * Authenticates against an authtoken id string. This can be extracted from header, or can be passed along directly
     * in some other way.
     */
    async authenticateTokenString(token){
        if (!token)
            throw new Exception({ code : constants.ERROR_INVALID_USER_OR_SESSION })

        let authToken = await authTokenLogic.getById(token)
        if (!authToken)
            throw new Exception({ code : constants.ERROR_INVALID_USER_OR_SESSION })

        return authToken
    }
}