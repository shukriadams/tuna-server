import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

export default class extends React.Component {
    render(){
        return (
            <Fragment>
                <h2>How it works</h2>
                <ol>
                    <li>Put your music in your local Dropbox/NextCloud folder (we currently support mp3s only).</li>
                    <li>Download and run our <Link to="/downloads">indexing utility</Link> in your Dropbox/NextCloud folder - this reads all your music's tags (song title, artist etc), which we need to organize your tunes.</li>
                    <li>Sign in to Tuna, and follow instructions to access Dropbox/NextCloud.</li>
                </ol>
            </Fragment>
        )
    }
}