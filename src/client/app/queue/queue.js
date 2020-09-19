import React from 'react'
import { Model, View as List } from './../list/list'
import SongHelper from './../songs/songsHelper'
import { connect } from 'react-redux'
import { playShowSongBrowser } from './../actions/actions'

class View extends React.Component {
    
    openBrowser(){
        playShowSongBrowser()
    }

    render() {
        let model = new Model('queue')
        model.context = 'queue'
        model.items = SongHelper.idsToObjects(this.props.queue.songs)

        return(
            <div className="queue">
                <div className="queue-gridScaffold">
                    {
                        model.items.length === 0 && this.props.songsCount > 0 && 
                            <div className="queue-empty">
                                Play queue is empty - you have <a onClick={this.openBrowser.bind(this)}> {this.props.songsCount} songs</a> available
                            </div>
                    }

                    {
                        model.items.length === 0 && this.props.songsCount === 0 &&
                            <div className="queue-empty">
                                Play queue is empty - you have no songs available. Try importing some?
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