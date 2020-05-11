import React, { Fragment } from 'react'
import { View as GluMultiColumnText, Model as GluMultiTextModel } from './../glu_multiColumnText/index'
import { View as Hero, Model as HeroModel } from './../hero/hero'

let heroModel = JSON.parse(JSON.stringify(HeroModel))
heroModel.text.title = 'Store your music on Dropbox, play it on any browser'
heroModel.text.titleWeight = 1
heroModel.text.text = null

let introModel = Object.assign({}, GluMultiTextModel)
introModel.header = { title : 'The streaming service for the serious music collector ', text : null } 
introModel.columns = 2
introModel.text = 'For some, it\'s not enough to rent music, we\'d prefer to own it. We also want to collect it from various sources. But how do we stream that collection when we\'re on the move? That\'s where <b>Tuna</b> comes in, it\'s a simple, free, self-hosted web-based player. It plays your music for you, without getting in your way.'


export default class extends React.Component {

    render() {
        return (
            <Fragment>
                <Hero {...heroModel} />
                <GluMultiColumnText {...introModel} />
                <a id="features"></a>
            </Fragment>
        )
    }
}
