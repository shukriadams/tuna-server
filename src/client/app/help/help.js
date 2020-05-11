import React from 'react'

export default class extends React.Component {
    render(){
        return(
            <div className="help">
                <h1>Stuck?</h1>
                <p>
                    Remember, you'll need to tag and index your music files before they can be played - install and run the indexer app, and point it
                    to your Dropbox/NextCloud folder where you've got your music files stored. You can download the index from the links below :
                </p>
                <ul>
                    <li>
                        <a href="https://github.com/shukriadams/tuna-indexer/releases/download/0.0.2/TunaIndexer_Setup_0.0.2.exe" target="_new">Windows</a>
                    </li>
                    <li>
                        Mac - coming soon
                    </li>
                    <li>
                        Linux - coming soon
                    </li>
                </ul>
                <p>
                    The <a href="https://github.com/shukriadams/Tuna-indexer" target="_new"> source code </a> for the indexer is available if you want to see what
                    exactly the app does inside.
                </p>
            </div>
        )
    }
}