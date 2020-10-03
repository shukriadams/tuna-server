/**
 * Tests calling an auth-required route without being authenticated. Route should throw an
 * auth exception.
 * 
 * routeFile : egs 'routes/song'
 * route : egs '/v1/song/:id'
*/
module.exports = async (routeFilePath, method, route)=> {
    const ctx = require(_$t+'testcontext'),
        routeFile = require(routeFilePath),
        constants = require(_$+'types/constants'),
        RouteTester = require(_$t+'helpers/routeTester'),
        routeTester = await new RouteTester(routeFile),
        routeFunc = routeTester[method]

    if (!routeFunc)
        throw `Route ${routeFilePath} does not have a method ${method}`

    await routeTester[method](route)

    ctx.assert.equal(routeTester.res.content.code, constants.ERROR_INVALID_USER_OR_SESSION)
}