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
      <div className="page page__register container auth-page">
        <h1 className="page__heading">Register</h1>
        {this.state.hasErrors &&
        <p className="form-error">Failed to register, please check your input</p>
        }
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Name"
              onChange={this.onNameChange}
            />
          </div>
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
            <input className="btn btn-main" type="submit" value="Register"/>
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
