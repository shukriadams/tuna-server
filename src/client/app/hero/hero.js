import React from 'react'
import ClassNames from 'classnames'
import { View as MediaElement, Model } from './../glu_mediaElement/index'

class View extends React.Component {
    render(){
        let modifiers = {}

        return (
            <div className={ClassNames(`hero`, modifiers )}>
                <MediaElement {...this.props} />
            </div>
        )
    }
}

View.defaultProps = Model

export { View, Model }
