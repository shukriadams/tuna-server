import React, { Fragment } from 'react'
import store from './../store/store'
import watch from 'redux-watch'
import ClassNames from 'classnames'
import { alertClear } from './../actions/actions'

/**
 * Displays standard API responses from server
 */
export default class extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            alert : null
        }

        store.subscribe(watch(store.getState, 'now.alert')( alert => {
            this.setState({
                alert
            })
        }))
    }
    
    clearAlert(){
        alertClear()
    }

    render(){
        const classNames = ClassNames(`alert alert--${this.state.alert && this.state.alert.error ? 'error'  : ''}`)

        return (
            <Fragment>
                { 
                    this.state.alert &&
                        <div className={classNames} onClick={this.clearAlert.bind(this)}>
                            {this.state.alert.message}
                        </div>
                }
            </Fragment>
        )
    }
}