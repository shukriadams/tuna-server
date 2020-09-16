import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import SongsToTreeStructure from './../songs/songsToTreeStructure'
import ReactSVG from 'react-svg'
import { View as List, Model as ListModel } from './../list/list'
import { filter } from './../search/searchLogic'
import debounce from 'debounce'
import plural from './../plural/index'
import { View as GluModal } from './../glu_modal/index'
import { playHideSongBrowser } from './../actions/actions'
import KeyWatcher from './../keyWatcher/index'
import history from './../history/history'

class View extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            search : null,

            // the letter to focus on, else show all letters
            letter : null,

            // artist to focus on, else show all artists for current letter
            artist : null,

            show : false
        }

        // debounce to limit search while typing
        this.onSearchChanged = debounce(this._onSearchChanged.bind(this), 500)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ show : nextProps.show })
    }

    componentDidMount(){
        new KeyWatcher({ key : 'Escape', onDown : () =>{
            playHideSongBrowser()
        }})
    }

    setLetter(letter){
        this.setState({ letter : letter })
    }

    setArtist(artist){
        // artistname is used as id, but lowercased and trimmed. we dont store this as object property to save on memory
        this.setState({artist : artist.toLowerCase() })
    }

    close(){
        this.state.search = null // force clear this so if reopen on search result, search can be properly redone
        playHideSongBrowser()
    }

    closeLetter(){
        this.setState({letter : null })
    }

    closeArtist(){
        this.setState({artist: null })
    }

    _onSearchChanged(){
        this.setState({ search : this.refs.search.value })
    }

    /**
     * Need to close song browser before navigating away, else it gets stuck invisible open state
     */
    showHelp(){
        playHideSongBrowser()
        history.push('help')
    }

    clearSearch(){
        this.setState({ search : null})
    }

    /**
     * Need to force set hide state when modal is closed from within
     */
    onModalClose(){
        playHideSongBrowser()
    }

    render(){
        let searchResults = new ListModel('songBrowserSearch'),
            songsToTreeStructure = new SongsToTreeStructure(this.props.songs),
            maxResults = 100,
            songs = null,
            hasSongs = this.props.songs.length > 0,
            artists = null,
            showBrowserHeader = !!hasSongs,
            searchPlaceholder = `Search your ${this.props.songs.length ? this.props.songs.length : ''} song${plural(this.props.songs, 's')}`,
            showSearch = false

        if (hasSongs && this.state.search && this.state.search.length > 1 ){
            
            showSearch = true

            if (this.state.search !== this.search){

                this.search = this.state.search
                let results = filter(this.state.search, maxResults)
                searchResults.context = 'search'
                searchResults.items = results.songs
                searchResults.maxExceeded = results.maxExceeded

            }

        }

        if (hasSongs){
            if (this.state.letter)
                artists = songsToTreeStructure.letters[this.state.letter].artists
            

            if (this.state.artist) {
                songs = new ListModel('songBrowserArtists')
                songs.items = songsToTreeStructure.artistsHash[this.state.artist].songs
            }
        }
    
        return (
            <div className="songBrowser">
                <GluModal onClose={this.onModalClose.bind(this)} show={this.state.show} closeSVG="/media/svg/close.svg">
                    <div className="songBrowser-scaffold">
                        <ReactSVG path="/media/svg/close.svg" onClick={this.close.bind(this)} className={`songBrowser-close`} />

                        {
                            !hasSongs &&
                                <div className="songBrowser-standaloneMessage">
                                    You currently don't have any songs to browse.Want to import some? Check out the <a onClick={this.showHelp.bind(this)}>help page</a> for more info.
                                </div>
                        }

                        {
                            showBrowserHeader &&
                                <div className="songBrowser-header">
                                    <div>

                                        <div className="songBrowser-headerTitle">
                                            { showSearch && <Fragment><a onClick={this.clearSearch.bind(this)}>Browse</a> </Fragment> }

                                            { !showSearch && <Fragment>Browse </Fragment> }
                                            or
                                        </div>

                                        <input className="songBrowser-search" type="text" onChange={this.onSearchChanged} ref="search" placeholder={searchPlaceholder} />

                                    </div>

                                    {
                                        showSearch &&
                                            <p>
                                                {searchResults.items.length} song{plural(searchResults.items)} found for <strong>{this.search}</strong>.&nbsp;
                                                {
                                                    searchResults.maxExceeded &&
                                                        <Fragment>
                                                            More matches were found, try narrowing your search.
                                                        </Fragment>
                                                }
                                            </p>
                                    }
                                </div>

                        }

                        {
                            hasSongs &&
                                <div className="songBrowser-frame">

                                    {
                                        showSearch &&
                                            <Fragment>
                                                <ul className="songBrowser-list">
                                                    <li>
                                                        <List {...searchResults} />
                                                    </li>
                                                </ul>
                                            </Fragment>
                                    }

                                    {
                                        !showSearch &&
                                            <Fragment>
                                                {/* always show this */}
                                                <ul className="songBrowser-list">
                                                    {
                                                        songsToTreeStructure.artistLettersArray.map(function(letter, index){

                                                            return (
                                                                <li key={index} className="songBrowser-item">
                                                                    <a className="songBrowser-itemLink" onClick={this.setLetter.bind(this, letter)}>
                                                                        {letter.toUpperCase()}
                                                                    </a>
                                                                </li>
                                                            )
                                                        }.bind(this))
                                                    }
                                                </ul>

                                                {
                                                    artists &&
                                                        <Fragment>
                                                            <div className="songBrowser-itemBack">
                                                                <a onClick={this.closeLetter.bind(this)} className="songBrowser-itemBackLink">
                                                                    <ReactSVG className="songBrowser-itemBackIcon" path={`/media/svg/left.svg`} />
                                                                    <div className="songBrowser-itemBackText">
                                                                        All
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            <div className="songBrowser-itemBackPad"></div>
                                                            <ul className="songBrowser-list">
                                                            {
                                                                artists.map(function(artist, index){
                                                                        return(
                                                                            <li key={index} className="songBrowser-item">
                                                                                <a onClick={this.setArtist.bind(this, artist.name)} className="songBrowser-itemLink">
                                                                                    {artist.name}
                                                                                </a>
                                                                            </li>
                                                                        )
                                                                    }.bind(this))
                                                            }
                                                            </ul>
                                                        </Fragment>
                                                }

                                                {
                                                    songs &&
                                                        <Fragment>
                                                            <div className="songBrowser-itemBack">
                                                                <a onClick={this.closeArtist.bind(this)} className="songBrowser-itemBackLink">
                                                                    <ReactSVG className="songBrowser-itemBackIcon" path={`/media/svg/left.svg`} />
                                                                    <span className="songBrowser-itemBackText">{this.state.artist}</span>
                                                                </a>
                                                            </div>
                                                            <ul className="songBrowser-list">
                                                                <li>
                                                                    <List {...songs} />
                                                                </li>
                                                            </ul>
                                                        </Fragment>
                                                }
                                            </Fragment>
                                    }
                                </div>                            
                        }

                    </div>
                </GluModal>
            </div>
        )
    }
}

View.defaultProps = {
    // show this control
    show : false
}

// redux mapping
export default connect(
    (state) => {
        return {
            songs : state.session.songs,
        }
    }
)(View)