import React from 'react'
import { sessionSet, playListSetAll, songsSet } from './../actions/actions'
import history from './../history/history'
import { PROFILE } from './../routes/routes'
import sessionHelper from './../helpers/sessionHelper'

class View extends React.Component {

    async componentDidMount(){
        const content = await sessionHelper.fetch()
        sessionSet(content.session)
        playListSetAll(content.playlists)
        songsSet(content.songs)
        history.push(`/${PROFILE}`)
    }

    render(){
        return (
            <div className="reload">
                Hang on, fetching data ...
            </div>
        )
    }
}

export { View }