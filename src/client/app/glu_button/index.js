import React, { Fragment } from 'react'
import Classnames from 'classnames'

class View extends React.Component {

    onClick(){
        if (this.props.onClick)
            this.props.onClick(this)
    }

    render(){
        let activeClasses = {}
        activeClasses[`glu_button--disabled`] = this.props.isDisabled

        let text = this.props.isDisabled ? this.props.disabledText : this.props.text

        return (
            <Fragment>
                {
                    this.props.mode === 'button' &&
                        <button className={Classnames(`glu_button`, activeClasses)} onClick={this.onClick.bind(this)}>
                            {text}
                        </button>
                }

                {
                    this.props.mode === 'link' &&
                        <Link className={Classnames(`glu_button`, activeClasses )} onClick={this.onClick.bind(this)}>
                            {text}
                        </Link>
                }

            </Fragment>

        )
    }
}

let Model = {

    text: 'button',

    disabledText: 'disabled',

    isDisabled: false,

    mode : 'button', // button | links

    // optional click handler
    onClick : null
}

View.defaultProps = Model

// version is needed because button is one of the few modules that doesn't render itself, so whatever consumes it
// needs its version to properly render markup for it
export { View }