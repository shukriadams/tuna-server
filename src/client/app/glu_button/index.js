import React, { Fragment } from 'react'
import Classnames from 'classnames'

class View extends React.Component {

    constructor(props){
        super(props);
        this.state = {

        }
    }

    onClick(){
        if (this.props.onClick)
            this.props.onClick(this)
    }

    setTemporaryText(string, timeout){
        this.setState({
            temporaryText : string
        })

        setTimeout(()=>{
            this.setState({
                temporaryText : null
            })
        }, timeout)
    }

    render(){
        let activeClasses = {}
        activeClasses[`glu_button--disabled`] = this.props.isDisabled

        let text = this.props.isDisabled ? this.props.disabledText : this.props.text
        if (this.state.temporaryText)
            text = this.state.temporaryText

        return (
            <Fragment>
                {
                    this.props.mode === 'button' &&
                        <button className={Classnames(`glu_button`, this.props.className, activeClasses)} onClick={this.onClick.bind(this)}>
                            {text}
                        </button>
                }

                {
                    this.props.mode === 'link' &&
                        <Link className={Classnames(`glu_button`, this.props.className, activeClasses )} onClick={this.onClick.bind(this)}>
                            {text}
                        </Link>
                }

            </Fragment>

        )
    }
}

let Model = {

    text: 'button',
    className : '',
    disabledText: 'disabled',
    fadeText : null,
    fadeTextTimeout : 4000, // in milliseconds
    isDisabled: false,

    mode : 'button', // button | links

    // optional click handler
    onClick : null
}

View.defaultProps = Model

// version is needed because button is one of the few modules that doesn't render itself, so whatever consumes it
// needs its version to properly render markup for it
export { View }