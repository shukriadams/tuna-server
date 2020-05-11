import React from 'react'
import ClassNames from 'classnames'

class View extends React.Component {

    render() {
        return (
            <div className={ClassNames('presenter', { 'presenter--standardMargin' : !this.props.fullBleed })}>
                <div className="presenter-title">{this.props.title}</div>
                <div className="presenter-content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

View.defaultProps = {
  title: 'your-title-here',
  fullBleed : true
}

export default View