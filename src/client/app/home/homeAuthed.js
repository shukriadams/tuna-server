import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Queue from './../queue/queue'
import queueHelper from './../queue/queueHelper'
import pubsub from './../pubsub/pubsub'
import history from './../history/history'
import { sessionSet } from './../actions/actions'
import { IMPORT } from './../routes/routes'
import sessionHelper from './../helpers/sessionHelper'
import appSettings from './../appSettings/appSettings'

class View extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            showArtistBrowser : false
        }
    }

    componentDidMount(){
        queueHelper.cleanQueue()
        pubsub.sub('homeAuthed', 'dropbox.connected', async ()=>{
            await this.onDropboxAdded()
        })
    }

    async onDropboxAdded(){
        const session = await sessionHelper.fetch()
        sessionSet(session.session)
        history.push(`/${IMPORT}`)
    }

    render(){

        let dropboxPrompt = ('')

        if (this.props.showDropboxPrompt)
            dropboxPrompt = (
            <Fragment>
                <h1>Find your music on {appSettings.sourceLabel}</h1>
                <p>
                    To play your music, you'll need to give us access to your music files on {appSettings.sourceLabel}.
                    Simply click the button below, you'll be temporarily taken to {appSettings.sourceLabel},
                    where you can do that.
                </p>
                <p>
                    <a className={`glu_button`} href={this.props.sourceOauthUrl.replace('TARGETPAGE', 'import')}>Connect</a>
                </p>
            </Fragment>)

        let playerContent = ('')
        if (this.props.showPlayer)
            playerContent = (
                <div className="home-browser">
                    <Queue />
                </div>
            )

        return(
            <div className="home-authenticated">
                {dropboxPrompt}
                {playerContent}
            </div>
        )
    }
}

export default connect(

    function (state) {
        const session = state.session || {}

        return {
            showPlayer : session.isSourceConnected,
            showDropboxPrompt: !session.isSourceConnected,
            sourceOauthUrl : session.sourceOauthUrl || ''
        }
    }

)(View)