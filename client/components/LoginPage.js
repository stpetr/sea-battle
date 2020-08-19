import React from 'react'
import { connect } from 'react-redux'
import { beginLogin, beginLoginAsAnonymous } from '../actions/auth'
import { Link } from 'react-router-dom'

export class LoginPage extends React.Component {
    constructor() {
        super()

        this.state = {
            email: '',
            password: '',
            hasErrors: false
        }
    }
    onEmailChange = (e) => {
        const email = e.target.value
        this.setState(() => ({ email }))
    }
    onPasswordChange = (e) => {
        const password = e.target.value
        this.setState(() => ({ password }))
    }
    signInAnonymously = () => {
        this.props.beginLoginAsAnonymous()
    }
    onSubmit = (e) => {
        e.preventDefault()

        this.setState({ hasErrors: false })
        this.props.beginLogin(this.state.email, this.state.password).catch(() => {
            this.setState({ hasErrors: true })
        })
    }
    render() {
        return (
            <div className="page page__login">
                <h1 className="page__heading">Login</h1>
                <p>Please fill in your credentials</p>
                { this.state.hasErrors &&
                    <p style={{color: 'crimson'}}>Failed to login, please check your input</p>
                }
                <form onSubmit={this.onSubmit}>
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
                <p>If you have not registered yet you can do it at the <Link to="/register">register page</Link></p>
                <p>Or you can <button className="btn" onClick={this.signInAnonymously}>sign in anonymously</button> but your scores will no be kept</p>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    beginLogin: (email, password) => dispatch(beginLogin(email, password)),
    beginLoginAsAnonymous: () => dispatch(beginLoginAsAnonymous()),
})

export default connect(undefined, mapDispatchToProps)(LoginPage)
