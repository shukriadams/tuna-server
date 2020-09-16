import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { View as GluSimpleHeader, Model as HeaderModel, ItemModel as HeaderItemModel } from './../glu_simpleHeader/index'
import { View as GluSimpleFooter } from './../glu_simpleFooter/index'
import { search } from './../actions/actions'
import PlayingStrip from './../playingStrip/playingStrip'
import ClassNames from 'classnames'
import SongBrowser from './../songBrowser/songBrowser'
import history from './../history/history'
import { PROFILE } from './../routes/routes'
import { View as CookieBanner } from './../glu_simpleCookieBanner/index'
import { Link } from 'react-router-dom'
import Alert from './../alert/alert'

function anonHeaderModel(){

    let login = Object.assign({ }, HeaderItemModel)
    login.href = 'login'
    login.title = 'Login'
    login.isRoute = true
    login.isActive = history.location.pathname === '/login'

    let model = Object.assign({}, HeaderModel)
    model.closeSVG = '/media/svg/close.svg'
    model.logoSVG = '/media/svg/sitelogo.svg'
    model.menuSVG = '/media/svg/burger.svg'
    model.title = 'Tuna'
    model.isDockedToWindowTop = false
    model.menuItems = [ login ]

    return model
}

function authenticatedHeaderModel(){
    
    const music = Object.assign({ }, HeaderItemModel)
    music.href = '/'
    music.title = 'Music'
    music.isRoute = true
    music.isActive = history.location.pathname === '/'

    const settings = Object.assign({ }, HeaderItemModel)
    settings.href = PROFILE
    settings.title = 'Profile'
    settings.isActive = history.location.pathname === `/${PROFILE}`
    settings.isRoute = true

    const playlists = Object.assign({ }, HeaderItemModel)
    playlists.href = '/playlists'
    playlists.title = 'Playlists'
    playlists.isActive = history.location.pathname.startsWith(`/playlist`)
    playlists.isRoute = true

    const help = Object.assign({}, HeaderItemModel)
    help.href = '/help'
    help.showOnScreenSize = 'small'
    help.title = 'Need help?'
    help.isRoute = true

    const terms = Object.assign({}, HeaderItemModel)
    terms.href = '/terms-of-service'
    terms.showOnScreenSize = 'small'
    terms.title = 'Terms'
    terms.isRoute = true

    let model = Object.assign({}, HeaderModel)
    model.closeSVG = '/media/svg/close.svg'
    model.logoSVG = '/media/svg/sitelogo.svg'
    model.menuSVG = '/media/svg/burger.svg'
    model.title = 'Tuna'
    model.menuItems = [ music, playlists, settings, terms, help]
    model.isDockedToWindowTop = false

    return model
}

let footModel = {
    sections : [
        {
            subTitle : null,
            links : [
                {
                    href : '/help',
                    text : 'Need help?',
                    isRoute : true
                },
                {
                    href : '/terms-of-service',
                    text : 'Terms',
                    isRoute : true,
                    iconSVG : null
                }
            ]
        }
    ],
    secondaryText : ''
}

class View extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            showCookieBanner : document.cookie.indexOf('acceptPolicy') === -1
        }
    }

    onSearchChange(arg){
        search(arg);
    }

    onCookieAccept(){
        document.cookie = 'acceptPolicy; expires=Fri, 3 Aug 2101 20:47:11 UTC; path=/'
        this.setState({
            showCookieBanner : false
        })
    }

    render() {
        let classNames = ClassNames('layout', { 'layout--fullSizePlayer' : this.props.playstripFullSize }),
            headerModel = this.props.isLoggedIn ? authenticatedHeaderModel() : anonHeaderModel()

        headerModel.search.placeholder = this.props.songCount === 0 ?
            'No songs to search yet' :
            `Search your ${this.props.songCount} song`
        headerModel.search.onChange = this.onSearchChange.bind(this)

        let cookieBannerButtonModel = {
            text : 'Accept',
            onClick : this.onCookieAccept.bind(this)
        }

        return (
            <div className={classNames}>
                <div className="layout-sticky">

                    {
                        this.state.showCookieBanner  &&
                            <CookieBanner buttonModel={cookieBannerButtonModel}>
                                This site uses a minimal amount of cookies for security and anonymous usage measurement.
                                Check our <Link to="/data-policy">data policy</Link> for more information.
                            </CookieBanner>
                    }

                    <GluSimpleHeader {... headerModel} />
                    
                    <Alert />

                    {
                        this.props.showPlayer &&
                            <Fragment>
                                <PlayingStrip />
                                <SongBrowser show={this.props.showSongBrowser} />
                            </Fragment>
                    }
                    
                </div>

                <div className="layout-content">
                    {this.props.children}
                </div>

                <GluSimpleFooter {...footModel} />
            </div>
        )
    }
}

View.defaultProps = {
    playstripFullSize : false
}

export default connect(
    (state) => {
        return {
            showPlayer : state.session.isSourceConnected && !!state.session.token && state.now.showPlayer,
            playstripFullSize : state.now.playstripFullSize,
            isLoggedIn: !!state.session.token,
            songCount : state.session.songs.length,
            showSongBrowser : state.playing.showSongBrowser
        }
    }
)(View)