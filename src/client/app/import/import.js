/**
  * Dropbox oauth will drop us back here on the import page.
  */
import React from 'react'
import Ajax from './../ajax/ajax'
import appSettings from './../appSettings/appSettings'
import { sessionSet, alertSet } from './../actions/actions'
import contentHelper from './../helpers/contentHelper';
import history from './../history/history'
import pubsub from './../pubsub/pubsub'

export default class extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            importMessage : '',
            percent : '',
            stage : 1 // 1|2|3|'error'
        }

        new Ajax().postAuth(`${appSettings.serverUrl}/v1/songs/import`, {}, response => {
            if (!response.code)
                sessionSet(response.payload)
            else 
                alertSet(response)
        })

        pubsub.sub('import', 'import.progress', async data =>{
            if (data.percent){
                this.setState({
                    percent : data.percent,
                    importMessage : data.text,
                    stage : 2
                })
            }
            else if (data.error){
                this.setState({
                    percent : data.text,
                    stage : 'error'
                })
            }
            else if (data.complete){

                this.setState({ stage : 3 })

                await contentHelper.fetch('songs,playlists,profile')
                history.push('/')

            } else {
                this.setState({
                    stage : 2,
                    importMessage : data.text
                })
            }

        })
    }

    render(){

        let currentStage = ('')

        if (this.state.stage === 1)
            currentStage = (
                <div className="import-stageOne">
                    Contacting server ...
                </div>)

        if (this.state.stage === 2)
            currentStage = (
                <div className="import-stageTwo">
                    {
                        this.state.percent &&
                            <div className="import-stageTwoPercent">{this.state.percent}%</div>
                    }
                    <div className="import-stageTwoMessage" dangerouslySetInnerHTML={{__html:this.state.importMessage}} />
                </div>)

        if (this.state.stage === 3)
            currentStage = (
                <div className="import-stageThree">
                    Import done! Cleaning up ...
                </div>)

        if (this.state.stage === 'error')
            currentStage = (
                <div className="import-stageError">
                    Importing failed. {this.state.importMessage}
                </div>)

        return(
            <div className="import">
                <h1>Importing songs</h1>
                {currentStage}
            </div>
        )
    }
}