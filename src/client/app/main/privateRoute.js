/**
 * Defines a route which requires user authentication.
 *
 * from : https://tylermcginnis.com/react-router-protected-routes-authentication/
 */
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import store from './../store/store'

let getAuth = () =>{
    let session = store.getState().session
    return !!session.token
}

const PrivateRoute = ({ component: Component, ...rest }) => (

    <Route {...rest} render={(props) => (
        getAuth() === true
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
)

export default PrivateRoute