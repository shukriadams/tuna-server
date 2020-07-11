import React, { Fragment } from 'react'

class Divider extends React.Component {
    render() {
        return (
            <Fragment>
                {
                    this.props.children && this.props.children.length &&
                        <div className="form-row">
                            <div className="form-divider">
                                {this.props.children}
                            </div>
                        </div>
                }

                {
                    !this.props.children &&
                        <div className="form-row">
                            <hr className="form-divider" />
                        </div>
                }

            </Fragment>
        )
    }
}

class Description extends React.Component {
    render() {
        return (
            <div className="form-description">
                {this.props.children}
            </div>
        )
    }
}

class Row extends React.Component {
    render() {
        return (
            <div className="form-row">
                {this.props.children}
            </div>
        )
    }
}

class Label extends React.Component {
    render() {
        return (
            <div className="form-row">
                <label className="form-label">
                    {this.props.children}
                </label>
            </div>
        )
    }
}

class TextField extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            value : null
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value : nextProps.defaultValue });
    }

    handleChange(event) {
      this.setState({value: event.target.value})
    }

    value(){
        return this.refs.field.value
    }

    render() {
        return (
            <input {...this.props} ref="field" className="form-textField" type="text" onChange={this.handleChange.bind(this)} />
        )
    }
}



class Form extends React.Component {
    render() {
        return (
            <div className="form">
                {this.props.children}
            </div>
        )
    }
}

class Error extends React.Component {
    render() {
        return (
            <span className="form-error">
                {this.props.children}
            </span>
        )
    }
}

export {Label, Divider, Row, Description, Form, Error, TextField}