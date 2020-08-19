import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { beginRegister } from '../actions/auth'

export class RegisterPage extends React.Component {
    constructor() {
        super()

        this.state = {
            name: '',
            email: '',
            password: '',
            hasErrors: false,
        }
    }
    onNameChange = (e) => {
        const name = e.target.value
        this.setState(() => ({ name }))
    }
    onEmailChange = (e) => {
        const email = e.target.value
        this.setState(() => ({ email }))
    }
    onPasswordChange = (e) => {
        const password = e.target.value
        this.setState(() => ({ password }))
    }
    onSubmit = (e) => {
        e.preventDefault()
        this.props.beginRegister({ ...this.state }).catch(() => {
            this.setState({ hasErrors: true })
        })
    }
    render() {
        return (
            <div className="page page__register">
                <h1 className="page__heading">Register</h1>
                <p>Please fill in your credentials</p>
                { this.state.hasErrors &&
                    <p style={{color: 'crimson'}}>Failed to register, please check your input</p>
                }
                <form onSubmit={this.onSubmit}>
                    <div>
                        <input type="text" name="name" onChange={this.onNameChange} />
                    </div>
                    <div>
                        <input type="text" name="email" onChange={this.onEmailChange} />
                    </div>
                    <div>
                        <input type="password" name="password" onChange={this.onPasswordChange} />
                    </div>
                    <div>
                        <input type="submit" value="Go" />
                    </div>
                </form>
                <p>If you already have an account, please login at the <Link to="/login">login page</Link></p>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    beginRegister: (user) => dispatch(beginRegister(user)),
})

export default connect(undefined, mapDispatchToProps)(RegisterPage)
