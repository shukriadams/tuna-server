import React from 'react'
import { Link } from 'react-router-dom'

export default class extends React.Component {

    render(){
        return (
            <div className="sessionExpired">
                <h1>Session Expired</h1>
                <p>
                    Your session has expired, and you have been logged out. You can log in again
                    <Link to="/login"> here</Link>.
                </p>
            </div>
        )
    }
}