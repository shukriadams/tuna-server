import React from 'react'
import pguid from 'pguid'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ajax from './../ajax/asyncAjax'
import appSettings from './../appSettings/appSettings'
import { sessionSet } from './../actions/actions'
import history from './../history/history'
import { View as Button } from './../glu_button/index'
import contentHelper from './../helpers/contentHelper'

class View extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            message : null,
            disable : false
        }
    }

    async login(){
        const password = this.refs.password.value.trim()

        if (!password)
            return this.setState( { message : 'Password required' } )

        this.setState( { disable : true } )
        
        let key = 'browserUID',
            browserUID = localStorage.getItem(key)

        if (!browserUID){
            browserUID = pguid()
            localStorage.setItem(key, browserUID)
        }

        try {
            const result = await ajax.postAnon(`${appSettings.serverUrl}/v1/session`,{
                password,
                browserUID
            })

            if (result.code)
                this.setState( { disable : false, message : result.message  } )            
            else {
                sessionSet(result.payload)
                await contentHelper.fetchSongs()
                history.push('/')
            }

        } catch(ex){
            console.log(ex)
            this.setState( { disable : false, message : ex } )
        } 

    }

    render(){
        return (
            <div className="login">
                <h1>
                    Log in
                </h1>

                <div className="form-row">
                    <input className="form-textField" type="text" readOnly value={appSettings.username} />
                </div>

                <div className="form-row">
                    <input ref="password" className="login-password form-textField" type="password" placeholder="Password" />
                </div>

                <div className="form-row">
                    <Button isDisabled={this.state.disable} text="Login" disabledText="Fetching data" onClick={this.login.bind(this)} />
                </div>

                <div className="form-row">
                    {
                        this.state.message &&
                            <span className="form-error">{this.state.message}</span>
                    }
                </div>

                <hr className="form-divider" />
                <div className="form-row"></div>

                <div className="form-row">
                    <Link to="/resetPassword">Forgot your password?</Link>
                </div>
            </div>
        )
    }
}

export default connect(
    function() {
        return { }
    }
)(View)