import React from 'react'
import { Model, View as List } from './../list/list'
import SongHelper from './../songs/songsHelper'
import { connect } from 'react-redux'

class View extends React.Component {

    render() {
        let model = new Model('queue')
        model.context = 'queue'
        model.items = SongHelper.idsToObjects(this.props.queue.songs)

        return(
            <div className="queue">
                <div className="queue-gridScaffold">
                    {
                        model.items.length === 0 &&
                            <div className="queue-empty">
                                Your playlist is empty. Search or browse your {this.props.songsCount} songs.
                            </div>
                    }
                    <List {...model} />
                </div>
            </div>
        )
    }
}

// redux mapping
export default connect(
    (state) => {
        return {
            queue : state.queue,
            songsCount : state.session.songs.length
        }
    }
)(View)