import React, { Fragment } from 'react'
import vc from 'vcjs'
import Ajax from './../ajax/ajax'
import { Link } from 'react-router-dom'
import appSettings from './../appSettings/appSettings'
import { View as Button } from './../glu_button/index'

export default class extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            emailError :null,
            'status' : null,
            hasPassed : false,
            keySent : false,
            isProcessing : false,
            keyCheckMode : false
        }
    }

    componentDidMount() {
        let key = vc.getQueryString('key')
        if (key){
            this.setState({keyCheckMode: true, status : 'Checking your key, hold on ...' })

            new Ajax().anon(`${appSettings.serverUrl}/v1/profile/verifyEmail?key=${key}`, (result)=>{
                if (result.errorCode)
                    this.setState({status : result.message })
                else
                    this.setState({ hasPassed : true, status : null }) 
            })
        }
    }

    onVerifySend(){
        let email = this.refs.email.value.trim()
        if (!email)
            return this.setState({ emailError : 'Please enter your email address' })

        this.setState({ isProcessing : true })

        new Ajax().anon(`${appSettings.serverUrl}/v1/profile/requestValidationEmail?email=${email}`, (result)=>{
            if (result.errorCode)
                this.setState({ emailError : result.message, isProcessing : false })
            else
                this.setState({ emailError : null, keySent: true, isProcessing : false})
        })
    }

    render() {
        return (
            <div className="verifyEmail">
                <h1>Verify your email address </h1>
                <Fragment>

                    {
                        !this.state.keyCheckMode &&
                            <div>

                                {
                                    !this.state.keySent &&
                                    <div>
                                        <div className="form-row">
                                            Enter your email address below and we'll send you instructions for verifying it. Verification is required to log in.
                                        </div>
                                        <div className="verifyEmail-form">
                                            <div className="form-row">
                                                <input ref="email" className="form-textField" type="text" placeholder="Your email" />
                                            </div>
                                            <div className="form-row">
                                                <Button isDisabled={this.state.isProcessing} disabledText="Processing..." onClick={this.onVerifySend.bind(this)} text="Send it" />
                                            </div>
                                            <div className="form-row">
                                                {
                                                    this.state.emailError &&
                                                        <span className="form-error">{this.state.emailError}</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }

                                {
                                    this.state.keySent &&
                                    <div>
                                        <p>
                                            We've sent you an email with verification instructions.
                                        </p>
                                    </div>
                                }

                            </div>
                    }

                    {
                        this.state.keyCheckMode &&
                        <div>
                            {
                                !this.state.hasPassed &&
                                    <p>{this.state.status}</p>
                            }

                            {
                                this.state.hasPassed &&
                                <p>
                                    Success - your email address has been verified. You may now <Link to="/login"> login</Link>.
                                </p>
                            }

                        </div>
                    }

                </Fragment>
            </div>
        )
    }
}
