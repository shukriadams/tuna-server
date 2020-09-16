import React from 'react'
import Presenter from './presenter/presenter'
import Layout from './../layout/layout'
import VerifyEmail from './../verifyEmail/verifyEmail'
import Login from './../login/login'
import Queue from './../queue/queue'
import NewPassword from './../newPassword/newPassword'
import ResetPassword from './../resetPassword/resetPassword'
import HomeAnonymous from './../home/homeAnon'
import HomeAuthenticated from './../home/homeAuthed'
import Home from './../home/home'
import Settings from './../settings/settings'
import FourOhFour from './../fourOhFour/fourOhFour'
import Help from './../help/help'
import How from './../how/how'
import ListExample from './../list/list-example'
import FormExample from './../form/form-example'
import SongBrowser from './../songBrowser/songBrowser'
import Import from './../import/import'; // can't display this yet, it triggers an import
import { View as GluSimpleHeader} from './../glu_simpleHeader/index'
import { View as GluTextIntro } from './../glu_textIntro/index'
import { View as GluMediaElement } from './../glu_mediaElement/index'
import { View as GluSimpleFooter } from './../glu_simpleFooter/index'
import { View as GluMultiColumnText } from './../glu_multiColumnText/index'
import { View as GluPicture} from './../glu_picture/index'
import { View as GluFeaturePriceMatrix } from './../glu_featurePriceMatrix/index'
import { View as GluTextIntroWithIconRow } from './../glu_textIntroWithIconRow/index'
import { View as GluModal } from './../glu_modal/index'
import { View as GluConfirmModal } from './../glu_confirmModal/index'
import { View as GluSlidingCheckbox } from './../glu_slidingCheckbox/index'
import PlayingStrip from './../playingStrip/playingStrip'
import footerModel from './models/footer.js'

export default class extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            showModal : false,
            showConfirmModal : false
        }
    }

    showModal (){
        this.setState({ showModal : true, showConfirmModal : false})
    }

    showConfirmModal (){
        this.setState({ showConfirmModal : true, showModal: false})
    }

    render() {
        return (
            <div className="kitchenSink">

                <Presenter title="glu_button">
                    <a className={`glu_button`}>Button</a>
                </Presenter>

                <Presenter title="glu_slidingCheckbox">
                    <GluSlidingCheckbox />
                </Presenter>

                <Presenter title="glu_simpleHeader" fullBleed={true}>
                    <GluSimpleHeader closeSVG="/media/svg/close.svg" logoSVG="/media/svg/sitelogo.svg" menuSVG="/media/svg/burger.svg" />
                    <br />
                    <br />
                    <br />
                    <br />
                </Presenter>

                <Presenter title="glu_textIntro">
                    <GluTextIntro />
                </Presenter>

                <Presenter title="glu_mediaElement with video" fullBleed={true}>
                    <GluMediaElement />
                </Presenter>

                <Presenter title="glu_mediaElement with image" fullBleed={true}>
                    <GluMediaElement video={null} />
                </Presenter>

                <Presenter title="glu_simpleFooter" fullBleed={true} >
                    <GluSimpleFooter {...footerModel} />
                </Presenter>

                <Presenter title="glu_multiColumnText">
                    <GluMultiColumnText />
                </Presenter>

                <Presenter title="glu_picture" >
                    <GluPicture />
                </Presenter>

                <Presenter title="glu_featurePriceMatrix">
                    <GluFeaturePriceMatrix />
                </Presenter>

                <Presenter title="glu_textIntroWithIconRow">
                    <GluTextIntroWithIconRow />
                </Presenter>

                <Presenter title="glu_modal">
                    <GluModal show={this.state.showModal} closeSVG="/media/svg/close.svg">
                        <div>Modal content</div>
                    </GluModal>
                    <button onClick={this.showModal.bind(this)}>Toggle modal</button>
                </Presenter>

                <Presenter title="glu_confirmModal">
                    <GluConfirmModal show={this.state.showConfirmModal} closeSVG="/media/svg/close.svg">
                        <div>Confirm Modal content</div>
                    </GluConfirmModal>
                    <button onClick={this.showConfirmModal.bind(this)}>Toggle</button>
                </Presenter>

                <Presenter title="layout" fullBleed={true}>
                    <Layout />
                </Presenter>

                <Presenter title="form">
                    <FormExample />
                </Presenter>

                <Presenter title="VerifyEmail">
                    <VerifyEmail />
                </Presenter>

                <Presenter title="Login">
                    <Login />
                </Presenter>

                <Presenter title="NewPassword">
                    <NewPassword />
                </Presenter>

                <Presenter title="ResetPassword">
                    <ResetPassword />
                </Presenter>

                <Presenter title="Home">
                    <Home />
                </Presenter>

                <Presenter title="HomeAnonymous">
                    <HomeAnonymous />
                </Presenter>

                <Presenter title="HomeAuthenticated">
                    <HomeAuthenticated />
                </Presenter>

                <Presenter title="Settings">
                    <Settings />
                </Presenter>

                <Presenter title="FourOhFour">
                    <FourOhFour />
                </Presenter>

                <Presenter title="Help">
                    <Help />
                </Presenter>

                <Presenter title="How">
                    <How />
                </Presenter>

                <Presenter title="PlayingStrip">
                    <PlayingStrip />
                </Presenter>

                <Presenter title="List">
                    <ListExample />
                </Presenter>

                <Presenter title="SongBrowser">
                    <div style={{height: '500px', position: 'relative'}}>
                        <SongBrowser />
                    </div>
                </Presenter>

                <Presenter title="Queue">
                    <Queue />
                </Presenter>

            </div>
        )
    }
}