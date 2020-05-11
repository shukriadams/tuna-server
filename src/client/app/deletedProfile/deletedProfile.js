import React from 'react'

export default class View extends React.Component {
    render(){
        return(
            <div className="deleteProfile">
                <h1>Account Deleted</h1>
                <p>
                    Your account has been deleted, and you have been logged off.
                </p>
            </div>
        )
    }
}