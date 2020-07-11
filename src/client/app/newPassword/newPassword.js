import React, { Fragment } from 'react'
import ajax from './../ajax/asyncAjax'
import appSettings from './../appSettings/appSettings'
import vc from 'vcjs'
import { Link } from 'react-router-dom'
import ReactSVG from 'react-svg'
import classnames from 'classnames'
import { View as Button } from './../glu_button/index'
import { connect } from 'react-redux'
import { Row, Description } from './../form/form'
import history from './../history/history'

class View extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            passwordEmpty : true,
            showPassword : false,
            errorMessage : null,
            missingKey : false,
            passwordError: null,
            authSuccessMessage : null,
            anonSuccessMessage : null
        }
    }

    componentWillMount(){
        let key = vc.getQueryString('key')
        if (!key)
            history.push('resetPassword')
    }

    showPassword(){
        this.setState({ showPassword : true })
    }

    hidePassword(){
        this.setState({ showPassword : false })
    }

    setPasswordState(){
        this.setState({passwordEmpty : this.refs.password.value.length === 0})
    }

    async submit(){
        let password = this.refs.password.value,
            current = this.props.isLoggedIn ? this.refs.currentPassword.value : null,
            key = vc.getQueryString('key')

        if (!password)
            return this.setState({ errorMessage : 'Password is required'})

        if (!current)
            return this.setState({ errorMessage : 'Current password is required'})

        if (password.length < 8)
            return this.setState({ errorMessage : 'Password must be at least 8 characters'})

        if (password === current)
            return this.setState({ errorMessage : 'Your new password cannot be identical to your current one'})

        if (this.props.isLoggedIn){
            if (!current)
                return this.setState({ errorMessage : 'Current password required'})

            const response = await ajax.authGet(`${appSettings.serverUrl}/v1/profile/resetPassword?password=${password}&currentPassword=${current}`)
            if (!response.code)
                this.setState({ authSuccessMessage : 'Your password has been updated.'})
            else 
                this.setState({errorMessage : response.message})

        } else{

            const response = await ajax.anonGet(`${appSettings.serverUrl}/v1/profile/resetPassword?password=${password}&key=${key}`)
            if (!response.code)
                this.setState({ anonSuccessMessage : 'Your password has been updated.'})
            else 
                this.setState({ errorMessage : response.message })
        }
    }

    render(){
        return (
            <div className="newPassword">
                <h1>
                    Change your password
                </h1>

                {
                    this.props.isLoggedIn &&
                    <Fragment>
                        <Row>
                            <label className="form-label">
                                Current password
                            </label>
                            <input className="form-textField" ref="currentPassword" type="password" />
                        </Row>
                    </Fragment>
                }

                <Row>
                    <label className="form-label">
                        New password
                    </label>
                    <div className={classnames('form-row newPassword-passwordFieldWrapper', {'newPassword-passwordFieldWrapper--disabled' : this.state.passwordEmpty })}>
                        <input onChange={this.setPasswordState.bind(this)} ref="password" maxLength="64" className="form-textField" type={ this.state.showPassword ? 'text' : 'password'} />
                        <a onMouseUp={this.hidePassword.bind(this)} onMouseDown={this.showPassword.bind(this)} title="View Password">
                            <ReactSVG className="newPassword-viewPasswordIcon" path="/media/svg/eye.svg"/>
                        </a>
                    </div>
                </Row>

                <Description>
                    {
                        <span>Your password should be at least 8 characters.</span>
                    }
                </Description>

                <Row>
                    <Button onClick={this.submit.bind(this)} text="Update" />
                </Row>

                <Row>
                    {
                        this.state.errorMessage &&
                            <span className="form-error">{this.state.errorMessage}</span>
                    }

                    {
                        this.state.anonSuccessMessage &&
                            <div>
                                <span>{this.state.anonSuccessMessage}</span>
                                Would you like to <Link to="/login">login</Link> now?
                            </div>
                    }

                    {
                        this.state.authSuccessMessage &&
                            <div>
                                <span>{this.state.authSuccessMessage}</span>
                            </div>
                    }
                </Row>
            </div>
        )
    }
}

export default connect(

     (state) => {
        return {
            isLoggedIn: !!state.session.token
        }
    }

)(View)