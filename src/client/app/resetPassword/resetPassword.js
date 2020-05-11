import React from 'react'
import Ajax from './../ajax/ajax'
import appSettings from './../appSettings/appSettings'

export default class extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            errorMessage : null,
            successMessage : null
        }
    }

    resetPassword(){
        let email = this.refs.email.value.trim()
        if (!email)
            return this.setState({ errorMessage : 'Email is required' })

        let ajax = new Ajax(),
            url = `${appSettings.serverUrl}/v1/profile/requestPassword?email=${email}`

        ajax.anon(url, (response)=>{
            if (!response.code){
                this.setState({ errorMessage: null, successMessage : 'An email with reset instructions has been sent to you.'})
                this.refs.email.value = ''
            } else
                this.setState({ errorMessage : response.message })
        })
    }

    render(){
        return (
            <div className="resetPassword">
                <h1>Forgot your password?</h1>

                <div className="form-row">
                    If you've forgotten your password, and you added an email address to your account, we can send you a new password.
                    Enter the email address associated with your account. If you haven't tied an email to your account, or forgot the
                    address, you can still get into your account - have your Tuna administrator reset your password directly on the
                    server.
                </div>

                <div className="form-row">
                    <input type="text" ref="email" className="form-textField" required="true" />
                </div>

                <div className="form-row">
                    <button onClick={this.resetPassword.bind(this)} className="button button--responsive">Send</button>
                </div>

                {
                    this.state.errorMessage &&
                        <div className="form-error">
                            {this.state.errorMessage}
                        </div>
                }

                {
                    this.state.successMessage &&
                        <div className="form-success">
                            {this.state.successMessage}
                        </div>
                }
            </div>
        )
    }
}