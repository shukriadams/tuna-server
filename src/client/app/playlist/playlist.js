import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import store from './../store/store';
import history from './../history/history'
import { View as Button } from './../glu_button/index'
import playlistHelper from './../playlist/playlistHelper'
import ajax from './../ajax/asyncAjax'
import appSettings from './../appSettings/appSettings'
import { playListSetAll } from './../actions/actions'
import DragHelper from './../helpers/draggablePlaylistHelper'
import ListSong from './../listSong/listSong'
import ListModel from './../store/models/listContextListModel'

class View extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            changingName : false,
            isBusySaving : false
        }
    }
    
    enterChangeName(){
        this.setState({ changingName : true })
    }

    leaveChangeName(){
        this.setState({ changingName : false })
    }
    
    async updateName(){
        if (!this.refs.name.value.length)
            return
            
        const playlist = playlistHelper.getById(this.props.id)
        playlist.name = this.refs.name.value

        this.setState({
            isBusySaving : true
        })

        const result = await ajax.post(`${appSettings.serverUrl}/v1/playlists`, playlist)
        playListSetAll(result.payload.playlists)

        this.setState({ 
            changingName : false, 
            isBusySaving : false
         })
    }
    
    componentDidMount(){
        if (this.refs.list)
            this.dragHelper = new DragHelper(this.refs.list, this.props.id, 'playlist', 'data-songid')
    }

    render(){
        // get this menu's redux state, else use a blank state model from Store
        let listContextModel = this.props.listContext[this.props.id] ?
            this.props.listContext[this.props.id] :
            Object.assign({}, ListModel)

        const songsInPlaylist = [],
            allSongs = store.getState().session.songs

        // handle no playlist found
        if (!this.props.playlist){
            return (
                <div>
                    Playlist not found
                </div>)
        }

        // get array of songs on playlist
        for (const songId of this.props.playlist.songs){
            const song = allSongs.find(song => song.id === songId)
            if (!song)
                continue

                songsInPlaylist.push(song)
        }

        return (
            <div className="playlist">
                <Link to="/playlists">All playlists</Link>
                <div>
                    {
                        !this.state.changingName &&
                        <Fragment>
                            <h2><a className="playlist-renameEnter" onClick={this.enterChangeName.bind(this)}>{this.props.playlist.name}</a></h2>
                            <div className="playlist-renameTooltip">
                                Click to rename
                            </div>
                        </Fragment>
                    }

                    {
                        this.state.changingName &&
                        <Fragment>
                            <input ref="name" defaultValue={this.props.playlist.name} type="text" />
                            <a onClick={this.updateName.bind(this)}>Save</a>
                            <a onClick={this.leaveChangeName.bind(this)}>Cancel</a>
                        </Fragment>
                    }


                    {
                        !songsInPlaylist.length &&
                            <div>
                                This in playlist is empty - add some songs to it
                            </div>
                    }

                    {
                        !!songsInPlaylist.length &&
                        <Fragment>

                            <ul ref="list" className="playlist" data-list={this.props.id}>
                                {
                                    songsInPlaylist.map((song, index) => (
                                        <ListSong
                                            key={index}
                                            song={song}
                                            draggedOver={listContextModel.draggedOverSongId === song.id}
                                            isScrollingPastCurrent={listContextModel.isScrollingPastCurrent}
                                            isSelected={listContextModel.selectedSongIds.includes(song.id)}
                                            context="playlist"
                                            rowNumber={index + 1}
                                            listId={this.props.id} />
                                        ))
                                }
                            </ul>

                            <div className="playlist-functions">
                                <Button text="Add to queue"></Button>
                                <Button text="Make queue"></Button>
                            </div>

                        </Fragment>
                    }

                </div>

            </div>
        )
    }
}

export default connect(
    (state, props)=>{
        return {
            listContext : state.listContext,
            playlist : state.session.playlists.find(playlist => playlist.id === props.id) 
        }
    }
)(View)

