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
      hasErrors: false,
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
  signInAnonymously = (e) => {
    e.preventDefault()
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
      <div className="page auth-page container">
        <h1 className="page__heading">Login</h1>
        {this.state.hasErrors &&
        <p className="form-error">Failed to login, please check your input</p>
        }
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="email"
              placeholder="Email"
              onChange={this.onEmailChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.onPasswordChange}
            />
          </div>
          <div>
            <input className="btn btn-main" type="submit" value="Login"/>
          </div>
        </form>

        <p>If you have not registered yet you can do it at the <Link to="/register">register page</Link></p>
        <p>Or you can <a href="#" onClick={this.signInAnonymously}>sign in anonymously</a> but your scores will not be
          kept</p>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  beginLogin: (email, password) => dispatch(beginLogin(email, password)),
  beginLoginAsAnonymous: () => dispatch(beginLoginAsAnonymous()),
})

export default connect(undefined, mapDispatchToProps)(LoginPage)
